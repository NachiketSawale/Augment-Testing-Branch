/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainRoundingConfigDetailValidationService
	 * @description provides validation methods for Rounding config detail instances
	 */
	angular.module(moduleName).factory('estimateMainRoundingConfigDetailValidationService',
		['_', '$injector', 'platformDataValidationService', 'estimateMainRoundingConfigDetailProcessService',
			function (_, $injector, platformDataValidationService, processService) {

				let service = {};

				angular.extend(service, {
					validateColumnId: validateColumnId,
					validateIsWithoutRounding: validateIsWithoutRounding,
					validateRoundTo: validateRoundTo,
					validateUiDisplayTo: validateUiDisplayTo,
					validateRoundToFk: validateRoundToFk,
					validateRoundingMethodFk: validateRoundingMethodFk
				});

				function isValidQuantityRange(entity, value, model){
					return platformDataValidationService.isAmong(entity, value, model, 0, 6);
				}

				function isValidPriceRange(entity, value, model){
					return platformDataValidationService.isAmong(entity, value, model, 0, 7);
				}

				function validateNumberRange(entity, value, model) {
					let result = !platformDataValidationService.isEmptyProp(value);
					if(result){
						let quantityColumnIds = [1,2,3,4,5];
						let costColumnIds = [6,7,8,9];

						if(quantityColumnIds.includes(entity.ColumnId)){
							result = isValidQuantityRange(entity, value, model);
						}
						if(costColumnIds.includes(entity.ColumnId)){
							result = isValidPriceRange(entity, value, model);
						}
					}
					return result;
				}

				function validateColumnId(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				}

				function validateIsWithoutRounding(entity, value, field) {
					let result = !platformDataValidationService.isEmptyProp(value);
					entity[field] = value;
					processService.processItem(entity);
					return result;
				}

				function validateRoundTo(entity, value, model) {
					return validateNumberRange(entity, value, model);
				}

				function validateUiDisplayTo(entity, value, model) {
					return validateNumberRange(entity, value, model);
				}

				function validateRoundToFk(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				}

				function validateRoundingMethodFk(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				}

				return service;
			}]);

})(angular);
