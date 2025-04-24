(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */
	angular.module('procurement.invoice').factory('procurementInvoiceBillingSchemaValidationService',
		['invoiceBillingSchemaDataService', 'procurementInvoiceHeaderDataService', 'prcCommonCalculationHelper', '$translate', 'platformRuntimeDataService', '$q', 'platformDataValidationService', '$http',
			function (dataService, headerDataService, prcCommonCalculationHelper, $translate, platformRuntimeDataService, $q, platformDataValidationService, $http) {

				var service = {};
				var parentItem, exchangeRate;

				service.validateValue = function validateValue(entity, value) {
					dataService.isBillingDirty = true;
					setResultValue(entity, value);
					return true;
				};

				service.validateResult = function (entity, value) {
					parentItem = headerDataService.getSelected();
					exchangeRate = 0;
					if (parentItem && parentItem.Id) {
						exchangeRate = parentItem.ExchangeRate;
					}
					entity.Result = value;
					entity.ResultOc = prcCommonCalculationHelper.round(value * exchangeRate);
					return true;
				};

				service.validateResultOc = function (entity, value) {
					parentItem = headerDataService.getSelected();
					exchangeRate = 0;
					if (parentItem && parentItem.Id) {
						exchangeRate = parentItem.ExchangeRate;
					}
					entity.ResultOc = value;
					entity.Result = prcCommonCalculationHelper.round(value / exchangeRate);
					return true;
				};
				service.asyncValidateControllingUnitFk = function (entity, value, model) {

					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					if (null === value) {
						defer.resolve(true);
					}
					else {
						var ProjectFk = entity.ProjectFk;
						$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
							if (response.data) {
								result = {
									apply: true,
									valid: false,
									error: $translate.instant('basics.common.error.controllingUnitError')
								};
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								defer.resolve(result);
							}
							else {
								defer.resolve(true);
							}
						});
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				function setResultValue(entity, value){
					var billingLineTypeFk = [23];
					var isInLineType = _.indexOf(billingLineTypeFk, entity.BillingLineTypeFk) === 0;
					if(isInLineType){
						entity.IsModification = true;
						entity.ResultOc = value;
						parentItem = headerDataService.getSelected();
						exchangeRate = 0;
						if (parentItem && parentItem.Id) {
							exchangeRate = parentItem.ExchangeRate;
						}
						entity.Result = prcCommonCalculationHelper.round(value / exchangeRate);
					}
				}

				return service;
			}
		]);
})(angular);