(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';
	/**
	 * @ngdoc service
	 * @name timekeepingRoundingConfigDetailValidationService
	 * @description provides validation methods for Rounding config detail instances
	 */
	angular.module(moduleName).factory('timekeepingRoundingConfigDetailValidationService',
		['_', '$injector', 'platformDataValidationService', 'timekeepingRoundingConfigDetailProcessService',
			function (_, $injector, platformDataValidationService, processService) {

				let service = {};

				angular.extend(service, {
					validateColumnId: validateColumnId,
					validateIsWithoutRounding: validateIsWithoutRounding,
					validateRoundToFk: validateRoundToFk,
					validateRoundingMethodFk: validateRoundingMethodFk
				});

				function validateColumnId(entity, value) {
					return !platformDataValidationService.isEmptyProp(value);
				}

				function validateIsWithoutRounding(entity, value, field) {
					let result = !platformDataValidationService.isEmptyProp(value);
					entity[field] = value;
					processService.processItem(entity);
					return result;
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
