/**
 * Created by Frank Baedeker on 25.08.2014.
 */

(function (angular) {
	/* global math */
	'use strict';

	var moduleName = 'project.location';

	/**
	 * @ngdoc service
	 * @name projectLocationValidationService
	 * @description provides validation methods for project entities
	 */
	angular.module(moduleName).factory('projectLocationValidationService', ['_', '$injector', 'platformDataValidationService',
		'basicsCompanyNumberGenerationInfoService',

		function (_, $injector, platformDataValidationService, basicsCompanyNumberGenerationInfoService) {
			let service = {
				validateCode: validateCode,
				validateSorting: validateSorting,
				validateQuantity: validateQuantity,
				validateQuantityPercent: validateQuantityPercent,

				updateAfterDelete: updateAfterDelete,
				updateAfterCreate: updateAfterCreate
			};

			return service;

			function validateCode (entity, value, model) {
				let selectedProject = $injector.get('projectMainService').getSelected();

				if (entity.Code !== value || !selectedProject || !selectedProject.RubricCatLocationFk ||
					!basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService').hasToGenerateForRubricCategory(selectedProject.RubricCatLocationFk)) {

					let locationService = $injector.get('projectLocationMainService');
					let items = locationService.getList();
					_.forEach(items, function(item){
						if (item && item.Code) {
							item.Code = item.Code.toUpperCase();
						}
					});

					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, locationService);
				}

				return true;
			}

			function validateSorting (entity, value ,model) {
				var locationService = $injector.get('projectLocationMainService');
				if(value <= 0) {
					return platformDataValidationService.finishValidation({
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.ValidationError_MustBeGreaterThan',
						error$tr$param$: { p_0: 'Sorting', p_1: '0' }
					}, entity, value, model, service, locationService);
				}else{
					platformDataValidationService.finishValidation(true, entity, value, model, service, locationService);
				}

				return true;
			}

			function validateQuantity (entity, value, model) {
				var locationService = $injector.get('projectLocationMainService');
				if(value < 0) {
					return platformDataValidationService.finishValidation({
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.ValidationError_MustBeGreaterThan',
						error$tr$param$: { p_0: 'Quantity Factor', p_1: '0' }
					}, entity, value, model, service, locationService);
				}else{
					platformDataValidationService.finishValidation(true, entity, value, model, service, locationService);
				}

				return true;
			}

			function validateQuantityPercent (/* entity, value */) {
				return true;
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
