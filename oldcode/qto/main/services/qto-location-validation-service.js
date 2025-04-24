(function (angular) {
	/* global math, _ */
	'use strict';

	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name projectLocationValidationService
	 * @description provides validation methods for project entities
	 */
	angular.module(moduleName).factory('qtoLocationValidationService', ['$injector', 'platformDataValidationService',
		'platformRuntimeDataService',
		function ($injector, platformDataValidationService,platformRuntimeDataService) {
			var dataSeriveName = 'qtoMainLocationDataService';
			var locationService = $injector.get(dataSeriveName);

			var service = {
				validateCode: validateCode,
				validateSorting: validateSorting,
				validateQuantity: validateQuantity,
				validateQuantityPercent: validateQuantityPercent,

				updateAfterDelete: updateAfterDelete,
				updateAfterCreate: updateAfterCreate
			};

			locationService.registerEntityCreated(onEntityCreated);

			function onEntityCreated(e, entity) {
				var result = service.validateCode(entity, entity.Code, 'Code');
				platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
			}

			return service;

			function validateCode (entity, value, model) {
				var items = locationService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, locationService);
			}

			function validateSorting (entity, value ,model) {
				if(value <= 0) {
					return platformDataValidationService.finishValidation({
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.greaterValueErrorMessage',
						error$tr$param$: { object: 'Sorting', value: '1' }
					}, entity, value, model, service, locationService);
				}else{
					platformDataValidationService.finishValidation(true, entity, value, model, service, locationService);
				}

				return true;
			}

			function validateQuantity (entity, value) {
				var result = true;
				if(value > 0.01) {
					result = true;

					var bigValue = math.bignumber(value);
					var actQuantity = math.bignumber(''+entity.Quantity);
					var quantityDelta = math.subtract(bigValue, actQuantity);
					var oldPercentage = math.bignumber(''+entity.QuantityPercent);
					var temp = 0.00;
					var rootLocs = locationService.getTree();
					_.forEach(rootLocs, function(rootLoc) {
						temp += rootLoc.Quantity;
					});
					var totalActQuantity = math.bignumber(temp);

					var newPercentage = math.multiply(math.divide(bigValue, math.add(totalActQuantity, quantityDelta)), math.bignumber(100.00));// Determine my part of new entire quantity

					entity.QuantityPercent = math.number(newPercentage);

					adjustChildren(entity, math.divide(newPercentage, oldPercentage), locationService, quantityDelta);
					adjustParentAndSiblings(entity, oldPercentage, newPercentage, locationService, quantityDelta);
				}

				return result;
			}

			function validateQuantityPercent (entity, value) {
				var result = true;
				if(value > 0.01 && value < 100.00) {
					result = true;

					var oldPercentage = math.bignumber(''+entity.QuantityPercent);
					var newPercentage = math.bignumber(value);

					entity.Quantity = math.number(math.multiply(math.bignumber(''+entity.Quantity), math.divide(newPercentage, oldPercentage)));

					adjustChildren(entity, math.divide(newPercentage, oldPercentage), locationService);
					adjustParentAndSiblings(entity, oldPercentage, newPercentage, locationService);
				}

				return result;
			}

			function updateAfterDelete(entity, service) {
				updateOtherLocationByEntityQuantity(entity, service, -entity.Quantity);
			}

			function updateAfterCreate(entity, service) {
				updateOtherLocationByEntityQuantity(entity, service, entity.Quantity);
			}

			function adjustChildren (entity, factor, locationService, quantityDelta) {
				_.forEach(entity.Locations, function(loc) {
					if(!quantityDelta) {
						loc.Quantity = math.number(math.multiply(math.bignumber(''+loc.Quantity), factor));
					}
					loc.QuantityPercent = math.number(math.multiply(math.bignumber(''+loc.QuantityPercent), factor));
					locationService.markItemAsModified(loc);

					adjustChildren(loc, factor, locationService, quantityDelta);
				});
			}

			function adjustParentAndSiblings (entity, oldPercentage, newPercentage, locationService, quantityDelta) {
				var factor = math.divide(math.bignumber(100.00) - newPercentage, math.bignumber(100.00) - oldPercentage);
				if(entity.LocationParentFk && entity.LocationParentFk > 0) {
					var locationList = locationService.getList();
					var parentLoc = _.find(locationList, { Id: entity.LocationParentFk} );
					if(parentLoc) {

						// First adjust siblings
						var oldParentPercentage = math.bignumber(''+parentLoc.QuantityPercent);
						var sumOfNewQuantity = math.bignumber(''+entity.Quantity);
						var sumOfNewPercentage = newPercentage;
						_.forEach(parentLoc.Locations, function(loc) {
							if(loc.Id !== entity.Id) {
								if(!quantityDelta) {
									loc.Quantity = math.number(math.multiply(math.bignumber(''+loc.Quantity), factor));
								}
								loc.QuantityPercent = math.number(math.multiply(math.bignumber(''+loc.QuantityPercent), factor));
								adjustChildren(loc, factor, locationService, quantityDelta);

								locationService.markItemAsModified(loc);

								sumOfNewPercentage = math.add(sumOfNewPercentage, loc.QuantityPercent);
								sumOfNewQuantity =  math.add(sumOfNewQuantity, loc.Quantity);
							}
						});

						// Adjust parent itself
						if(quantityDelta) {
							parentLoc.Quantity = math.number(math.add(math.bignumber(''+parentLoc.Quantity), quantityDelta));
						}
						else {
							parentLoc.Quantity = math.number(sumOfNewQuantity);
						}
						parentLoc.QuantityPercent = math.number(sumOfNewPercentage);
						locationService.markItemAsModified(parentLoc);

						adjustParentAndSiblings(parentLoc, oldParentPercentage, sumOfNewPercentage, locationService, quantityDelta);
					}
				}
				else {
					var siblingLocations = locationService.getTree();

					_.forEach(siblingLocations, function(loc) {
						if(loc.Id !== entity.Id) {
							if(!quantityDelta) {
								loc.Quantity = math.number(math.multiply(math.bignumber(''+loc.Quantity), factor));
							}
							loc.QuantityPercent = math.number(math.multiply(math.bignumber(''+loc.QuantityPercent), factor));
							adjustChildren(loc, factor, locationService, quantityDelta);
							locationService.markItemAsModified(loc);
						}
					});
				}
			}

			function updateOtherLocationByEntityQuantity(entity, service, entityChange) {
				if(entity.LocationParentFk && entity.LocationParentFk > 0)
				{
					var parent = service.getItemById(entity.LocationParentFk);
					var newParentQuantity = parent.Quantity + entityChange;
					if(newParentQuantity < 0.01) {
						newParentQuantity = 1.0;
					}

					validateQuantity(parent, newParentQuantity);
				}
				else {
					var siblingLocations = service.getTree();
					var totalQuantityOfOther = 0.0;

					_.forEach(siblingLocations, function(loc) {
						if(loc.Id !== entity.Id) {
							totalQuantityOfOther += loc.Quantity;
						}
					});

					var changedTotalQuantity = totalQuantityOfOther + entityChange;
					var factor = math.divide(math.bignumber(changedTotalQuantity), math.bignumber(totalQuantityOfOther));

					_.forEach(siblingLocations, function(loc) {
						if(loc.Id !== entity.Id) {
							loc.QuantityPercent = math.number(math.multiply(math.bignumber(''+loc.QuantityPercent), factor));
							adjustChildren(loc, factor, service, entityChange);
						}
					});
				}
			}
		}
	]);

})(angular);
