/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesCommonExchangerateService
	 * @function
	 *
	 * @description
	 * salesCommonExchangerateService provides api to sales common exchange logic (e.g. get the exchange rate for a given currency id)
	 */
	salesCommonModule.factory('salesCommonExchangerateService', ['_', 'globals', '$log', '$http', '$q', 'platformRuntimeDataService', 'salesCommonContextService', 'PlatformMessenger',
		'$timeout',
		'$translate',
		'platformModalService',
		'platformModuleStateService',
		'platformDataValidationService',
		function (_, globals, $log, $http, $q, platformRuntimeDataService, salesCommonContextService, PlatformMessenger,
			$timeout,
			$translate,
			platformModalService,
			platformModuleStateService,
			platformDataValidationService) {
			var service = {};
			var modifyRateDialogOptions = {
				headerTextKey: 'procurement.common.changeCurrencyHeader',
				templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-commom-modify-exchangerate-dialog.html'
			};

			service.getExchangeRate = function getExchangeRate(companyId, currencyForeignId, projectId, getRateThrowException) {
				var throwException = getRateThrowException ? !!getRateThrowException : false;
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'sales/common/exchangerate/rate',
					params: {
						companyId: companyId,
						currencyForeignId: currencyForeignId,
						projectId: projectId,
						throwException: throwException
					}
				});
			};

			function warnOverrideProperty(service2Extend, funcName) {
				if (_.has(service2Extend, funcName)) {
					$log.warn(funcName + ' was overwritten by salesCommonExchangerateService!');
				}
			}

			function updateExchangeRateRequest(dataService, entity, url, options) {
				if (entity) {
					if (dataService.updateAndExecute && _.isFunction(dataService.updateAndExecute)) {
						dataService.updateAndExecute(function () {
							$http.post(url, options)
								.then(function (result) {
									if (result.data === true) {
										dataService.refresh();
									}
								});
						});
					}
					else {
						if (dataService.updateExchangeRateRequest && _.isFunction(dataService.updateExchangeRateRequest)) {
							dataService.updateExchangeRateRequest(entity, options, url);
						}
					}
				}
				else {
					var message = $translate.instant('cloud.common.noCurrentSelection');
					platformModalService.showMsgBox(message,  'Info', 'ico-info');
				}
			}

			function updateExchangeRate(entity, dataService, options) {
				var url = _.has(options, 'url') ? options.url : null;
				var remainNet = _.has(options, 'remainNet') ? options.remainNet : false;
				var newRate = _.has(options, 'newRate') ? options.newRate : null;
				var params = {
					HeaderId: entity.Id,
					RemainNet: remainNet,
					NewRate: newRate,
					isSameCurrency: options.isSameCurrency
				};
				if (_.has(options, 'newCurrencyId')) {
					params.NewCurrencyId = options.newCurrencyId;
				}
				updateExchangeRateRequest(dataService, entity, url, params);
			}

			function rejectModifyRate(dataService, options) {
				var selectedItem = dataService.getSelected();
				if (selectedItem && selectedItem.Id) {
					$timeout(function () {
						var currencyField = _.has(selectedItem, 'BasCurrencyFk') ? 'BasCurrencyFk' : 'CurrencyFk';
						var originalRate = _.has(options, 'originalRate') ? options.originalRate : null;
						var originalCurrency = _.has(options, 'originalCurrency') ? options.originalCurrency : null;
						if (!_.isNil(originalRate)) {
							selectedItem['ExchangeRate'] = originalRate;
						}
						if (!_.isNil(originalCurrency)) {
							selectedItem[currencyField] = originalCurrency;
						}
						dataService.gridRefresh();
					});
				}
			}

			function resolveModifyRate(entity, dataService, options) {
				updateExchangeRate(entity, dataService, options);
			}

			function asyncModifyRatePopup(entity, value, model, validateService, dataService, options) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				asyncMarker.myPromise = platformModalService.showDialog(modifyRateDialogOptions).then(function (result) {
					var noApplyesult = {apply: false, valid: true};
					platformDataValidationService.finishAsyncValidation(noApplyesult, entity, value, model, asyncMarker, validateService, dataService);
					var modState = platformModuleStateService.state(dataService.getModule());
					var asyncCalls = _.get(modState, 'validation.asyncCalls');
					if (asyncCalls.length) {
						var asyncMarker2 = _.find(asyncCalls, {filed: model});
						platformDataValidationService.finishAsyncValidation(noApplyesult, entity, value, model, asyncMarker2, validateService, dataService);
					}
					if (result.no) {
						rejectModifyRate(dataService, options);
						return $q.reject();
					}
					else {
						options.remainNet = result.remainNet;
						resolveModifyRate(entity, dataService, options);
						return $q.reject();
					}
				});
				return asyncMarker.myPromise;
			}

			function validatRateWhenIsZero(entity, value, model, validateService, dataService, options) {
				var defer = $q.defer();
				var noResult = {apply: false, valid: true};
				var p;
				if (model === 'ExchangeRate') {
					p = function () {
						defer.resolve();
						return defer.promise;
					};
				}
				else {
					p = function () {
						return platformModalService.showMsgBox('procurement.common.changeCurrencyRateIsZero', 'procurement.common.changeCurrencyHeader', 'info');
					};
				}
				return p().then(function () {
					var modState = platformModuleStateService.state(dataService.getModule());
					var asyncCalls = _.get(modState, 'validation.asyncCalls');
					if (asyncCalls.length) {
						var asyncMarker = _.find(asyncCalls, {filed: model});
						platformDataValidationService.finishAsyncValidation(noResult, entity, value, model, asyncMarker, validateService, dataService);
					}
					var selectedItem = dataService.getSelected();
					if (selectedItem && selectedItem.Id) {
						$timeout(function () {
							var currencyField = _.has(selectedItem, 'BasCurrencyFk') ? 'BasCurrencyFk' : 'CurrencyFk';
							var originalRate = _.has(options, 'originalRate') ? options.originalRate : null;
							var originalCurrency = _.has(options, 'originalCurrency') ? options.originalCurrency : null;
							if (!_.isNil(originalRate)) {
								selectedItem['ExchangeRate'] = originalRate;
							}
							if (!_.isNil(originalCurrency)) {
								selectedItem[currencyField] = originalCurrency;
							}
							dataService.gridRefresh();
						});
					}
					return $q.reject();
				});
			}

			function asyncModifyRate(entity, value, model, validateService, dataService, options) {
				if (!value) {
					return validatRateWhenIsZero(entity, value, model, validateService, dataService, options);
				}
				else {
					return asyncModifyRatePopup(entity, value, model, validateService, dataService, options);
				}
			}

			service.extendByExchangeRateLogic = function extendByExchangeRateLogic(service2Extend) {
				warnOverrideProperty(service2Extend, 'exchangeRateChanged');
				service2Extend.exchangeRateChanged = new PlatformMessenger();

				warnOverrideProperty(service2Extend, 'setExchangeRate');
				service2Extend.setExchangeRate = function setExchangeRate(entity, newExchangeRate) {
					service2Extend.exchangeRateChanged.fire(entity, {
						ExchangeRate: newExchangeRate,
						IsCurrencyChanged: false
					});
					entity.ExchangeRate = newExchangeRate;
					if (_.isFunction(service2Extend.markItemAsModified)) {
						service2Extend.markItemAsModified(entity);
					}
				};

				warnOverrideProperty(service2Extend, 'setAsyncExchangeRate');
				service2Extend.setAsyncExchangeRate = function setAsyncExchangeRate(entity, newExchangeRate, model, url) {
					var originalRate = entity.ExchangeRate;
					return asyncModifyRate(entity, newExchangeRate, model, service, service2Extend, {
						url: url,
						newRate: newExchangeRate,
						originalRate: originalRate
					});
				};

				warnOverrideProperty(service2Extend, 'setExchangeRateByCurrency');
				service2Extend.setExchangeRateByCurrency = function setExchangeRateByCurrency(entity, currencyId) {
					var company = salesCommonContextService.getCompany();
					var isSameCurrency = _.get(company, 'CurrencyFk') === currencyId;
					platformRuntimeDataService.readonly(entity, [{field: 'ExchangeRate', readonly: isSameCurrency}]);

					var companyId = _.get(company, 'Id');
					var promiseExchangeRate = isSameCurrency ? $q.when({data: 1}) :
						service.getExchangeRate(companyId, currencyId, entity.ProjectFk);

					promiseExchangeRate.then(function (value) {
						var exchangeRate = value.data;
						service2Extend.exchangeRateChanged.fire(entity, {
							ExchangeRate: exchangeRate,
							IsCurrencyChanged: true
						});
						entity.ExchangeRate = exchangeRate;
						if (_.isFunction(service2Extend.fireItemModified)) {
							service2Extend.fireItemModified(entity);
						}
					});
				};

				warnOverrideProperty(service2Extend, 'setAsyncExchangeRateByCurrency');
				service2Extend.setAsyncExchangeRateByCurrency = function setAsyncExchangeRateByCurrency(entity, currencyId, model, url, getRateThrowException) {
					var company = salesCommonContextService.getCompany();
					var isSameCurrency = _.get(company, 'CurrencyFk') === currencyId;

					var companyId = _.get(company, 'Id');
					var promiseExchangeRate = isSameCurrency ? $q.when({data: 1}) :
						service.getExchangeRate(companyId, currencyId, entity.ProjectFk, getRateThrowException);
					var originalCurrency = entity[model];
					var originalRate = entity['ExchangeRate'];

					return promiseExchangeRate.then(function (value) {
						return asyncModifyRate(entity, value, model, service, service2Extend, {
							url: url,
							newRate: value.data,
							newCurrencyId: currencyId,
							originalRate: originalRate,
							originalCurrency: originalCurrency,
							isSameCurrency: isSameCurrency
						});
					});
				};
			};

			return service;
		}]);
})();
