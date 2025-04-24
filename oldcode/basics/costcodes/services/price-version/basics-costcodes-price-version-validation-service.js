/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodeskValidationService
	 * @description provides validation methods for CostCodes instances
	 */
	angular.module(moduleName).factory('basicsCostCodesPriceVersionValidationService',
		['platformRuntimeDataService', 'platformDataValidationService', 'basicsCostCodesPriceVersionDataService',
			function (platformRuntimeDataService, platformDataValidationService, dataService) {

				let service = {};

				service.validatePriceListFk = function validateRate(entity, value, model) {
					value = value > 0 ? value : null;
					let validateResult = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};


				service.validateValidFrom = function validateValidFrom(entity, value, model) {
					let validateResult = {apply: true, valid: true};
					if (entity.ValidTo) {
						if (value > entity.ValidTo) {
							validateResult.valid = false;
							validateResult.error$tr$ = 'cloud.common.Error_EndDateTooEarlier';
						}
					}
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);

					platformRuntimeDataService.applyValidationResult(validateResult, entity, 'ValidTo');
					platformDataValidationService.finishValidation(validateResult, entity, entity.ValidTo, 'ValidTo', service, dataService);
					return validateResult;
				};
				service.validateValidTo = function validateValidTo(entity, value, model) {
					let validateResult = {apply: true, valid: true};
					if (entity.ValidFrom) {
						if (entity.ValidFrom > value) {
							validateResult.valid = false;
							validateResult.error$tr$ = 'cloud.common.Error_EndDateTooEarlier';
						}
					}
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);

					platformRuntimeDataService.applyValidationResult(validateResult, entity, 'ValidFrom');
					platformDataValidationService.finishValidation(validateResult, entity, entity.ValidFrom, 'ValidFrom', service, dataService);
					return validateResult;
				};

				service.validateWeighting = function validateWeighting(entity, value, model) {
					value = value > 0 ? value : null;
					let validateResult = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.validateEntity = function validateEntity(entity) {
					let result = service.validatePriceListFk(entity, entity.PriceListFk, 'PriceListFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'PriceListFk');
					result = service.validateWeighting(entity, entity.Weighting, 'Weighting');
					platformRuntimeDataService.applyValidationResult(result, entity, 'Weighting');
				};

				return service;
			}
		]);
})(angular);
