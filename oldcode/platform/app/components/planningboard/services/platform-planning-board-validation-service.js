(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformPlanningBoardValidationService', PlatformPlanningBoardValidationService);

	PlatformPlanningBoardValidationService.$inject = ['_'];

	function PlatformPlanningBoardValidationService(_) {
		var service = this;
		var suppliers = [];
		var mappingServices = {
			supplier: false,
			assignment: false,
			demand: false
		};

		// return interface
		service.result = {
			isValid: true,
			invalidItems: []
		};

		// public functions
		service = {
			validateEntityAgainstSupplier: validateEntityAgainstSupplier,
			validateSelectedAgainstList: validateSelectedAgainstList,
			setSuppliers: setSuppliers,
			supplierMapService: supplierMapService,
			assignmentMapService: assignmentMapService,
			demandMapService: demandMapService
		};

		/**
		 * @ngdoc function
		 * @name validateEntityAgainstSupplier
		 * @description Validates the given entity against his assigned supplier.
		 * It returns the result interface with the isValid information and all invalid items.
		 *
		 * @param entity: entity to validate against the supplier
		 * @param type: the type of the entity
		 * @param supplierId: id of the supplier
		 * @param pbGridDefaultSetting:  pb grid default setting value
		 *
		 * @return service.result interface:
		 * isValid: boolean if the validation is valid
		 * invalidItems: all invalid items
		 **/
		function validateEntityAgainstSupplier(entity, type, supplierId, pbGridDefaultSetting) {
			resetReturnValues();

			if (_.isNil(supplierId)) {
				return service.result;
			}
			var supplier = _.find(suppliers, {'Id': supplierId});

			if (!_.isFunction(mappingServices.supplier.validateWith)) {
				console.warn('There is no validateWith method in mappingServices.supplier.');
				return service.result;
			}
			var supplierValidationArray = mappingServices.supplier.validateWith(supplier, pbGridDefaultSetting);

			if (!_.isFunction(mappingServices[type].validateAgainst)) {
				console.warn('There is no validateAgainst method in mappingServices.' + type + '.');
				return service.result;
			}
			var entityValidationArray = mappingServices[type].validateAgainst(entity, pbGridDefaultSetting);
			if (_.isNull(entityValidationArray)) { // no need for validation because there are no requirements
				return service.result;
			}

			if (!_.isNull(entityValidationArray) && _.isNull(supplierValidationArray)) {
				_.forEach(entityValidationArray, function (entity) {
					if (entity && mappingServices[type].isMandatory(entity)) {
						// service.result is only invalid if on item is mandatory
						service.result.isValid = false;
						service.result.invalidItems.push(entity);
					}
				});
				return service.result;
			}

			if (entityValidationArray.length > 0 && supplierValidationArray.length > 0) {
				if (_.isFunction(mappingServices.demand.compareWith)) {
					let providedList = filterIsMandatory(supplierValidationArray, mappingServices.supplier);
					let requiredList = filterIsMandatory(entityValidationArray, mappingServices[type]);

					for (let i = 0; i < requiredList.length; i++) {
						let requiredSkill = requiredList[i];
						let coveredBy = _.find(providedList, function (providedSkill) {
							/* the "mappingServices[itemType].compareWith" function is expected to return true or false:
								- true: if the given required skill is covered by the given provided skill
								- false: otherwise
							*/
							return mappingServices.demand.compareWith(requiredSkill, providedSkill);
						});

						if (typeof coveredBy === 'undefined') {
							/* Quit the check as soon as the first not covered requirement is found */
							service.result.isValid = false;
							service.result.invalidItems.push(requiredSkill);
						}
					}

				} else {
					/* Original logic */
					if (entityValidationArray.length > 0 && supplierValidationArray.length > 0) {
						var entityValidationIds = _.map(entityValidationArray, function (entity) {
							return mappingServices[type].id(entity);
						});
						var supplierValidationIds = _.map(supplierValidationArray, function (validation) {
							return mappingServices.supplier.id(validation);
						});

						var diffIds = _.difference(entityValidationIds, supplierValidationIds);

						if (diffIds.length > 0) {
							_.forEach(diffIds, function (id) {
								var invalidItem = _.find(entityValidationArray, function (validation) {
									return id === validation.Id;
								});
								if (invalidItem && service.result.isValid === true) {
									// service.result is only invalid if on item is mandatory
									service.result.isValid = !mappingServices.demand.isMandatory(invalidItem);
								}
								service.result.invalidItems.push(invalidItem);
							});
						}
					}
				}
			}

			return service.result;
		}

		/**
		 * @ngdoc function
		 * @name validateSelectedAgainstList
		 * @description Validates the given item against a list of entities.
		 *
		 * @param item: single item
		 * @param entities: array of entities
		 * @param itemType: type of item
		 * @param entityType: type of entity
		 * @param pbGridDefaultSetting: pb grid default setting value
		 *
		 * @return list of valid entities
		 **/
		function validateSelectedAgainstList(item, entities, itemType, entityType, pbGridDefaultSetting) {
			var validItemList = [];
			var validationArray = [];

			if (!_.isFunction(mappingServices.demand.validateAgainst)) {
				console.warn('There is no validateAgainst method in mappingServices.demand.');
				return entities;
			}

			if (!_.isFunction(mappingServices.supplier.validateWith)) {
				console.warn('There is no validateWith method in mappingServices.supplier.');
				return entities;
			}

			if (itemType === 'supplier') {
				validationArray = mappingServices.supplier.validateWith(item, pbGridDefaultSetting);
				if (_.isNull(validationArray)) {
					validationArray = [];
				}
			} else if (itemType === 'demand') {
				validationArray = mappingServices.demand.validateAgainst(item, pbGridDefaultSetting);
				if (_.isNull(validationArray)) {
					validationArray = [];
				}
			} else {
				console.warn('There is no [' + itemType + '] type for this validation.');
				return entities;
			}

			if (validationArray.length === 0) {
				return entities;
			}

			_.forEach(entities, function (entity) {
				var entityArray = [];
				if (entityType === 'supplier') {
					entityArray = mappingServices.supplier.validateWith(entity, pbGridDefaultSetting);
				} else if (entityType === 'demand') {
					entityArray = mappingServices.demand.validateAgainst(entity, pbGridDefaultSetting);
				}
				var mandatoryIndex = _.findIndex(validationArray, function (validation) {
					return mappingServices[itemType].isMandatory(validation);
				});

				/*
				var mandatoryIndex = _.findIndex(validationArray, function (validation) {
					return mappingServices.supplier.isMandatory(validation);
				});
				 */
				if (mandatoryIndex < 0) {
					validItemList.push(entity);
					// return nothing to do anymore
				}
				else {
					entityArray = filterIsMandatory(entityArray, mappingServices[entityType]); //itemType
					validationArray = filterIsMandatory(validationArray, mappingServices[itemType]);

					if (_.isFunction(mappingServices.demand.compareWith)) {
						let requiredList = itemType === 'demand' ? validationArray : entityArray;
						let providedList = entityType === 'supplier' ? entityArray: validationArray;

						for (let i = 0; i < requiredList.length; i++) {
							let requiredSkill = requiredList[i];
							let coveredBy = _.find(providedList, function (providedSkill) {
								/* the "mappingServices[itemType].compareWith" function is expected to return true or false:
									- true: if the given required skill is covered by the given provided skill
									- false: otherwise
								*/
								return mappingServices.demand.compareWith(requiredSkill, providedSkill);
							});

							if (typeof coveredBy === 'undefined') {
								/* Quit the check as soon as the first not covered requirement is found */
								return;
							}
						}

						/* If all requirements are covered - push to the valid list */
						validItemList.push(entity);

					} else {
						/* Original logic */
						var entityValidationIds = _.map(entityArray, function (entity) {
							return mappingServices[entityType].id(entity);
						});
						var itemValidationIds = _.map(validationArray, function (validation) {
							return mappingServices[itemType].id(validation);
						});

						var diffIds = _.difference(itemValidationIds, entityValidationIds);

						// if no difference between arrays - valid item
						if (diffIds.length === 0) {
							validItemList.push(entity);
						}
					}

				}
			});

			return validItemList;
		}

		// helper functions
		function setSuppliers(values) {
			suppliers = values;
		}

		function filterIsMandatory(array, mapService) {
			if (_.isFunction(mapService.isMandatory)) {
				return _.filter(array, function (item) {
					return mapService.isMandatory(item);
				});
			} else {
				console.warn('There is no function for this mapping service.', mapService);
				return [];
			}
		}

		function resetReturnValues() {
			service.result = {
				isValid: true,
				invalidItems: []
			};
		}

		// get/set for mappingServices
		function supplierMapService(service) {
			if (!_.isUndefined(service)) {
				mappingServices.supplier = service;
			}
			return mappingServices.supplier;
		}

		function assignmentMapService(service) {
			if (!_.isUndefined(service)) {
				mappingServices.assignment = service;
			}
			return mappingServices.assignment;
		}

		function demandMapService(service) {
			if (!_.isUndefined(service)) {
				mappingServices.demand = service;
			}
			return mappingServices.demand;
		}

		return service;
	}
})(angular);