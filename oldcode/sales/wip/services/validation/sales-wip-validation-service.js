/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';

	// TODO: improve name
	angular.module(moduleName).factory('salesWipValidationHelperService',
		['globals', '$http', 'platformDataValidationService',
			function (globals, $http, platformDataValidationService) {
				return {
					asyncValidateCode: function asyncValidateCode(companyId, code) {
						return $http.get(globals.webApiBaseUrl + 'sales/wip/isuniquecode?companyId=' + companyId + '&code=' + code).then(function (response) {
							return (response.data === true) ? true : platformDataValidationService.createErrorObject('sales.common.errorCodeMustBeUniqueInCompany');
						});
					}
				};
			}
		]);

	/**
	 * @ngdoc service
	 * @name salesWipValidationService
	 * @description provides validation methods for wip header entities
	 */
	angular.module(moduleName).factory('salesWipValidationService',
		['globals', '$http', '$q', '$injector', 'platformDataValidationService', 'salesWipService', 'salesWipBillingSchemaService', 'salesCommonValidationServiceProvider', '$translate', 'platformRuntimeDataService',
			function (globals, $http, $q, $injector, platformDataValidationService, salesWipService, salesWipBillingSchemaService, salesCommonValidationServiceProvider, $translate, platformRuntimeDataService) {
				var service = salesCommonValidationServiceProvider.getInstance(salesWipService);
				var updateExchangeRateUrl = globals.webApiBaseUrl + 'sales/wip/updateExchangeRate';

				// TODO:
				// - mandatory fields like code, project etc. (at least all in 'create a wip' dialog)

				service.validateCode = function validateCode(entity, value, model) {
					var res = {apply: true, valid: true, error: ''};
					if (entity.ClerkFk) {
						res = service.validateClerkFk(entity, entity.ClerkFk, 'ClerkFk');
						platformDataValidationService.finishValidation(res, entity, entity.ClerkFk, 'ClerkFk', service, salesWipService);
						platformRuntimeDataService.applyValidationResult(res, entity, 'ClerkFk');
					}

					if (entity.OrdHeaderFk) {
						res = service.validateClerkFk(entity, entity.OrdHeaderFk, 'OrdHeaderFk');
						platformDataValidationService.finishValidation(res, entity, entity.OrdHeaderFk, 'OrdHeaderFk', service, salesWipService);
						platformRuntimeDataService.applyValidationResult(res, entity, 'OrdHeaderFk');
					}
					return platformDataValidationService.validateMandatory(entity, value, model, service, salesWipService);
				};

				service.asyncValidateCode = function (entity, modelValue, field) {
					var companyId = entity.CompanyFk || -1,
						code = modelValue,
						url = globals.webApiBaseUrl + 'sales/wip/isuniquecode?companyId=' + companyId + '&code=' + code + '&entityid=' + entity.Id;

					var finishAsyncValidationHelper = function (apply, valid) {
						return platformDataValidationService.finishAsyncValidation({
							apply: apply,
							valid: valid,
							error$tr$: 'sales.common.errorCodeMustBeUniqueInCompany'
						}, entity,
						modelValue, field, asyncMarker, self, salesWipService);
					};

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, code, salesWipService);
					asyncMarker.myPromise = $http.get(url).then(function (result) {
						return finishAsyncValidationHelper(true, result.data);
					},
					function () {
						return finishAsyncValidationHelper(false, false);
					});

					return asyncMarker.myPromise;
				};

				service.asyncValidateRubricCategoryFk = function asyncValidateRubricCategoryFk(/* entity, value */) {
					// check if status is available
					var url = globals.webApiBaseUrl + 'sales/wip/status/IsStatusAvailable';

					var defer = $q.defer();
					$http.get(url).then(function (result) {
						defer.resolve(!result.data ? platformDataValidationService.createErrorObject('sales.wip.errorNoStatusForSelectedCategory') : true);
					});

					return defer.promise;
				};

				service.validateCompanyResponsibleFk = function validateCompanyResponsibleFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, salesWipService);
				};

				service.validateClerkFk = function validateClerkFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, salesWipService);
				};

				service.validateOrdHeaderFk = function validateOrdHeaderFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, salesWipService);
				};

				service.validateProjectFk = function validateProjectFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, salesWipService);
				};

				service.validateContractTypeFk = function validateContractTypeFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, service, salesWipService);
				};

				service.validatePerformedFrom = function (entity, newValue) {
					return service.validateDate(entity, newValue, entity.PerformedTo);
				};

				service.validatePerformedTo = function (entity, newValue) {
					return service.validateDate(entity, entity.PerformedFrom, newValue);
				};

				service.handleError = function (entity, result) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'PerformedFrom');
						platformRuntimeDataService.applyValidationResult(result, entity, 'PerformedTo');
					} else {
						service.removeError(entity, 'PerformedFrom');
						service.removeError(entity, 'PerformedTo');
					}
				};
				service.validateDate = function (entity, fromDate, toDate) {
					var result = true;
					if (fromDate !== null && toDate !== null) {
						if (fromDate > toDate) {
							result = {
								apply: false, valid: false,
								error: $translate.instant('sales.wip.dateError')
							};
						}
					}
					service.handleError(entity, result);
					return result;
				};

				service.removeError = function (entity, field) {
					platformRuntimeDataService.applyValidationResult(true, entity, field);
				};

				service.validateDocumentDate = function (entity, value) {
					entity.DateEffective = value || entity.DateEffective;
				};

				service.validateBillingSchemaFk = function validateBillingSchemaFk(entity, value) {
					return value ? self.onValidateBillingSchemaFk(entity, value, true) : true;
				};

				service.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, currencyId, model) {
					return salesWipService.setAsyncExchangeRateByCurrency(entity, currencyId, model, updateExchangeRateUrl);
				};

				service.asyncValidateDateEffective = function asyncValidateDateEffective(entity,value,model) {
					let salesCommonDateEffectiveValidateService = $injector.get('salesCommonDateEffectiveValidateService');
					return salesCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model,'salesWipBoqStructureService', salesWipService, service,'sales.wip');
				};

				service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
					return salesWipService.setAsyncExchangeRate(entity, value, model, updateExchangeRateUrl);
				};

				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model) {
					value = value === 0 ? null : value; // handle 0 as null
					return platformDataValidationService.validateMandatory(entity, value, model, service, salesWipService);
				};

				self.onValidateBillingSchemaFk = function onValidateBillingSchemaFk(entity, value, fireEvent, forceReload) {
					if (entity.BillingSchemaFk !== value || forceReload) {
						entity.BillingSchemaFk = value;
						salesWipBillingSchemaService.getWipData(entity);
						salesWipService.reloadBillingSchemas();
					}
					return true;
				};

				return service;
			}
		]);
})();
