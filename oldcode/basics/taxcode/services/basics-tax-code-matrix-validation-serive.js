/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.taxcode';


	angular.module(moduleName).factory('basicsTaxCodeMatrixValidationService', ['platformRuntimeDataService', 'platformDataValidationService', 'basicsTaxCodeMatrixService','$translate',
		function (platformRuntimeDataService, platformDataValidationService, dataService,$translate) {
			var service = {};

			service.validateCode = function (entity, value, field) {
				var result = platformDataValidationService.isMandatory(value, field);
				platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
				platformDataValidationService.finishValidation(result, entity, value, field, service, dataService);
				return result;
			};

			service.validateBasVatcalculationtypeFk = function (entity, value, field) {
				var result;
				if (!value) {
					result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: field.toLowerCase()});
				}
				else {
					result = platformDataValidationService.createSuccessObject();
				}
				platformRuntimeDataService.applyValidationResult(result, entity, field);
				platformDataValidationService.finishValidation(result, entity, value, field, service, dataService);
				return result;
			};

			service.validateBpdVatgroupFk = function (entity, value, field) {
				var result;
				if (!value) {
					result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: field.toLowerCase()});
				}
				else {
					result = platformDataValidationService.createSuccessObject();
				}
				platformRuntimeDataService.applyValidationResult(result, entity, field);
				platformDataValidationService.finishValidation(result, entity, value, field, service, dataService);
				return result;
			};

			service.validateValidFrom = function (entity, value, model) {
				return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, dataService, 'ValidTo');
			};

			service.validateValidTo = function (entity, value, model) {
				return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
			};


			function onEntityCreated(e, item) {
				service.validateCode(item, item.Code, 'Code');
				service.validateBasVatcalculationtypeFk(item, item.BpdVatgroupFk, 'BpdVatgroupFk');
				service.validateBasVatcalculationtypeFk(item, item.BasVatcalculationtypeFk, 'BasVatcalculationtypeFk');
			}

			dataService.registerEntityCreated(onEntityCreated);

			return service;
		}
	]);
})(angular);
