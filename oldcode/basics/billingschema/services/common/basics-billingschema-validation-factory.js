/**
 * Created by wed on 5/21/2018.
 */
(function (angular) {
	'use strict';
	angular.module('basics.billingschema').factory('basicsBillingSchemaValidationFactory', ['_', 'globals', 'platformDataValidationService','platformRuntimeDataService','$translate','$q','$http','prcCommonCalculationHelper',
		function (_, globals, platformDataValidationService,runtimeDataService,$translate,$q,$http,prcCommonCalculationHelper) {
			function getService(qualifier, dataService) {
				var service = {};
				var parentItem, exchangeRate;
				service.asyncValidateControllingUnitFk = function (entity, value, model) {
					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					var curModuleName = dataService.getModule().name;
					if (null === value) {
						defer.resolve(true);
					}
					else {
						if (curModuleName === 'procurement.pes' || curModuleName === 'procurement.invoice') {
							var ProjectFk = entity.ProjectFk;
							$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
								if (response.data) {
									result = {
										apply: true,
										valid: false,
										error: $translate.instant('basics.common.error.controllingUnitError')
									};
									runtimeDataService.applyValidationResult(result, entity, model);
									defer.resolve(result);
								}
								else {
									defer.resolve(true);
								}
							});
						}
						else {
							defer.resolve(true);
						}
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};
				service.validateValue = function validateValue(entity, value) {
					setResultValue(entity, value);
					return true;
				};
				function setResultValue(entity, value){
					var billingLineTypeFk = [23];
					var isInLineType = _.indexOf(billingLineTypeFk, entity.BillingLineTypeFk) === 0;
					if(isInLineType){
						entity.IsModification = true;
						entity.ResultOc = value;
						parentItem = dataService.getParentSelected();
						exchangeRate = 0;
						if (parentItem && parentItem.Id) {
							exchangeRate = parentItem.ExchangeRate;
						}
						entity.Result = prcCommonCalculationHelper.round(value / exchangeRate);
					}
				}
				return service;
			}
			return {
				getService: getService
			};
		}]);
})(angular);