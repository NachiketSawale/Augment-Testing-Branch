(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_, math */
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('prcAndSalesContractAdvanceValidationService', [
		'$translate',
		'platformDataValidationService',
		'platformRuntimeDataService',
		'procurementContractAdvanceDataService' ,
		'prcCommonCalculationHelper',
		function (
			$translate,
			platformDataValidationService,
			platformRuntimeDataService,
			dataService,
			prcCommonCalculationHelper
		) {
			return function (dataService) {
				var service = {};

				service.validateDateDue = function validateDateDue(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					handleError(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					return result;
				};

				service.validateAmountDue = function validateAmountDue(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === '') {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					else{
						let exchangeRate = getExchangeRate();
						entity[model + 'Oc'] = round(math.bignumber(value).mul(exchangeRate));
					}
					handleError(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					return result;
				};

				service.validatePercentProrata = function validatePercentProrata(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === '') {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					handleError(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					return result;
				};

				service.validateReductionValue = function validateReductionValue(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === '') {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					handleError(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					return result;
				};

				service.validateAmountDone = function validateAmountDone(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === '') {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					else{
						let exchangeRate = getExchangeRate();
						entity[model + 'Oc'] = round(math.bignumber(value).mul(exchangeRate));
					}
					handleError(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					return result;
				};

				service.validateAmountDueOc = function validateAmountDue(entity, value/* , model */) {
					let exchangeRate = getExchangeRate();
					entity.AmountDue = round(math.bignumber(value).div(exchangeRate));
				};

				service.validateAmountDoneOc = function validateAmountDone(entity, value/* , model */) {
					let exchangeRate = getExchangeRate();
					entity.AmountDone = round(math.bignumber(value).div(exchangeRate));
				};

				service.validateSlsAdvanceTypeFk = function validateSlsAdvanceTypeFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === '' || value === 0) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					handleError(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					return result;
				};

				function handleError(result, entity, model) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					} else {
						removeError(entity, model);
					}
				}

				function removeError(entity, model) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors[model] = null;
					}
				}

				function round(value) {
					return _.isNaN(value) ? 0 : prcCommonCalculationHelper.round(value);
				}

				function getExchangeRate() {
					var header = dataService.parentService().getSelected();
					return header !== null ? header.ExchangeRate : 1;
				}

				return service;
			};
		}
	]);
})(angular);