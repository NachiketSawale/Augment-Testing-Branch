/**
 * $Id: boq-main-rounding-config-detail-validation-service.js 46191 2022-07-14 17:40:38Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainRoundingConfigDetailValidationService
	 * @description provides validation methods for Rounding config detail instances
	 */
	angular.module(moduleName).factory('boqMainRoundingConfigDetailValidationService',
		['_', '$injector', 'platformDataValidationService', 'boqMainRoundingConfigDetailProcessService',
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
