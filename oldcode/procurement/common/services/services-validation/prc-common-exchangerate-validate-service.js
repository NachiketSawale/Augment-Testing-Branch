(function (angular) {
	'use strict';
	/* global _, globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).service('procurementCommonExchangerateValidateService', [
		'$q',
		'$http',
		'$timeout',
		'$injector',
		'$translate',
		'platformModuleStateService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'overDiscountValidationService',
		'platformModalService',
		'procurementCommonPriceConditionService',
		function (
			$q,
			$http,
			$timeout,
			$injector,
			$translate,
			platformModuleStateService,
			platformRuntimeDataService,
			platformDataValidationService,
			overDiscountValidationService,
			platformModalService,
			procurementCommonPriceConditionService
		) {
			var self = this;
			var modifyRateDialogOptions = {
				headerTextKey: 'procurement.common.changeCurrencyHeader',
				templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-commom-modify-exchangerate-dialog.html'
			};

			function exchangeUpdatedOverDiscount(args, dataService) {
				var selectedItem = dataService.getSelected();
				if (selectedItem) {
					var options = Object.assign({}, args);
					options.HeaderItem = selectedItem;
					overDiscountValidationService.exchangeUpdatedOverallDiscount(options);
				}
			}

			let changeExchangeRatePromises = {};
			function updateExchangeRateRequest(dataService, entity, url, options) {
				if (entity) {
					const key = generatePromiseKey(url, entity);
					if (changeExchangeRatePromises[key]) {
						changeExchangeRatePromises[key].then(function () {
							requestPromise(dataService, entity, url, options);
						});
					}
					else {
						requestPromise(dataService, entity, url, options);
					}
				} else {
					var message = $translate.instant('cloud.common.noCurrentSelection');
					platformModalService.showMsgBox(message, 'Info', 'ico-info');
				}
			}

			function requestPromise(dataService, entity, url, options) {
				const defer = $q.defer();
				const key = generatePromiseKey(url, entity);
				dataService.update().then(function () {
					$http.post(url, options)
						.then(function (result) {
							if (result.data === true) {
								dataService.refreshSelectedEntities().then(function () {
									let selected = dataService.getSelected();
									if (selected) {
										if (dataService.clearDataSelectedItem && _.isFunction(dataService.clearDataSelectedItem)) {
											dataService.clearDataSelectedItem();
											dataService.setSelected(selected);
										}
										let priceConditionService = procurementCommonPriceConditionService.getService();
										priceConditionService.clearCache();
										priceConditionService.loadSubItemList();
									}
								});
							}
							defer.resolve();
						})
						.finally(function () {
							changeExchangeRatePromises[key] = undefined;
						});
				});
				changeExchangeRatePromises[url+entity.Id] = defer.promise;
				return defer.promise;
			}

			function generatePromiseKey(url, entity) {
				return url + entity.Id;
			}

			function updateExchangeRate(entity, remainNet, dataService, url) {
				dataService.markItemAsModified(entity);
				entity.DealWithRateUpdateLater = true;
				updateExchangeRateRequest(dataService, entity, url, {
					HeaderId: entity.Id,
					RemainNet: remainNet
				});
			}

			function applyValidtionAndFinishForRate(result, entity, value, validateService, dataService) {
				platformRuntimeDataService.applyValidationResult(result, entity, 'ExchangeRate');
				platformDataValidationService.finishValidation(result, entity, value, 'ExchangeRate', validateService, dataService);
				return result;
			}

			function rejectModifyRate(entity, value, model, asyncMarker, validateService, dataService, originalRate, originalCurrency) {
				var noResult = {apply: false, valid: true};
				platformDataValidationService.finishAsyncValidation(noResult, entity, value, model, asyncMarker, validateService, dataService);
				var modState = platformModuleStateService.state(dataService.getModule());
				var asyncCalls = _.get(modState, 'validation.asyncCalls');
				if (asyncCalls.length) {
					var asyncMarker2 = _.find(asyncCalls, {filed: model});
					platformDataValidationService.finishAsyncValidation(noResult, entity, value, model, asyncMarker2, validateService, dataService);
				}
				var selectedItem = dataService.getSelected();
				if (selectedItem && selectedItem.Id) {
					$timeout(function () {
						var currencyField = _.has(selectedItem, 'BasCurrencyFk') ? 'BasCurrencyFk' : 'CurrencyFk';
						if (!_.isNil(originalRate)) {
							selectedItem.ExchangeRate = originalRate;
						}
						if (!_.isNil(originalCurrency)) {
							selectedItem[currencyField] = originalCurrency;
						}
						dataService.gridRefresh();
					});
				}
				return $q.reject();
			}

			function resolveModifyRate(entity, remainNet, dataService, url) {
				var options = {RemainNet: remainNet};
				exchangeUpdatedOverDiscount(options, dataService);
				updateExchangeRate(entity, remainNet, dataService, url);
				return true;
			}

			function validatRateWhenIsZero(entity, value, model, validateService, dataService, originalRate, originalCurrency) {
				var defer = $q.defer();
				var noResult = {apply: false, valid: true};
				var p;
				if (model === 'ExchangeRate') {
					p = function () {
						defer.resolve();
						return defer.promise;
					};
				} else {
					if (entity.Version === 0) {
						var errRes = {apply: true, valid: false, error: $translate.instant('procurement.common.changeCurrencyRateIsZero')};
						platformRuntimeDataService.applyValidationResult(errRes, entity, 'ExchangeRate');
						platformDataValidationService.finishValidation(errRes, entity, value, 'ExchangeRate', validateService, dataService);
						defer.resolve(true);
						return defer.promise;
					}
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
							if (!_.isNil(originalRate)) {
								selectedItem.ExchangeRate = originalRate;
							}
							if (!_.isNil(originalCurrency)) {
								selectedItem[currencyField] = originalCurrency;
							}
							dataService.gridRefresh();
						});
					} else {
						if (entity) {
							$timeout(function () {
								var currencyField = _.has(selectedItem, 'BasCurrencyFk') ? 'BasCurrencyFk' : 'CurrencyFk';
								if (!_.isNil(originalRate)) {
									entity.ExchangeRate = originalRate;
								}
								if (!_.isNil(originalCurrency)) {
									entity[currencyField] = originalCurrency;
								}
							});
						}
					}
					return $q.reject();
				});
			}

			function asyncModifyRatePopup(entity, value, model, validateService, dataService, url, originalRate, originalCurrency) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				if (entity.Version === 0) {
					var defer = $q.defer();
					var noRes = {apply: false, valid: true};
					platformDataValidationService.finishAsyncValidation(noRes, entity, value, model, asyncMarker, validateService, dataService);
					var modState = platformModuleStateService.state(dataService.getModule());
					var asyncCalls = _.get(modState, 'validation.asyncCalls');
					if (asyncCalls.length) {
						var asyncMarker3 = _.find(asyncCalls, {filed: model});
						platformDataValidationService.finishAsyncValidation(noRes, entity, value, model, asyncMarker3, validateService, dataService);
					}
					defer.resolve();
					return defer.promise;
				}
				asyncMarker.myPromise = platformModalService.showDialog(modifyRateDialogOptions).then(function (result) {
					if (result.no) {
						return rejectModifyRate(entity, value, model, asyncMarker, validateService, dataService, originalRate, originalCurrency);
					} else {
						var remainNet = result.remainNet;
						return resolveModifyRate(entity, remainNet, dataService, url);
					}
				});
				return asyncMarker.myPromise;
			}

			function asyncModifyRatePopupThenCheckBoq(entity, value, model, validateService, dataService, url, checkBoqPromise, checkBoqMsgBox, originalRate, originalCurrency) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				if (entity.Version === 0) {
					var defer = $q.defer();
					var noRes = {apply: false, valid: true};
					platformDataValidationService.finishAsyncValidation(noRes, entity, value, model, asyncMarker, validateService, dataService);
					var modState = platformModuleStateService.state(dataService.getModule());
					var asyncCalls = _.get(modState, 'validation.asyncCalls');
					if (asyncCalls.length) {
						var asyncMarker3 = _.find(asyncCalls, {filed: model});
						platformDataValidationService.finishAsyncValidation(noRes, entity, value, model, asyncMarker3, validateService, dataService);
					}
					defer.resolve();
					return defer.promise;
				}
				asyncMarker.myPromise = platformModalService.showDialog(modifyRateDialogOptions).then(function (result) {
					if (result.no) {
						return rejectModifyRate(entity, value, model, asyncMarker, validateService, dataService, originalRate, originalCurrency);
					} else {
						return checkBoqPromise().then(function (res) {
							if (!res.data) {
								var remainNet = result.remainNet;
								return resolveModifyRate(entity, remainNet, dataService, url);
							} else {
								return checkBoqMsgBox().then(function () {
									return rejectModifyRate(entity, value, model, asyncMarker, validateService, dataService, originalRate, originalCurrency);
								});
							}
						});
					}
				});
				return asyncMarker.myPromise;
			}

			self.asyncModifyRate = function asyncModifyRate(entity, value, model, validateService, dataService, url, originalRate, originalCurrency) {
				if (!entity.ExchangeRate) {
					return validatRateWhenIsZero(entity, value, model, validateService, dataService, originalRate, originalCurrency);
				} else {
					var yesResult = {apply: false, valid: true};
					applyValidtionAndFinishForRate(yesResult, entity, entity.ExchangeRate, validateService, dataService);
					return asyncModifyRatePopup(entity, value, model, validateService, dataService, url, originalRate, originalCurrency);
				}
			};

			self.asyncModifyRateThenCheckBoq = function asyncModifyRateThenCheckBoq(entity, value, model, validateService, dataService, url, checkBoqPromise, checkBoqMsgBox, originalRate, originalCurrency) {
				if (!entity.ExchangeRate) {
					return validatRateWhenIsZero(entity, value, model, validateService, dataService, originalRate, originalCurrency);
				} else {
					var yesResult = {apply: false, valid: true};
					applyValidtionAndFinishForRate(yesResult, entity, entity.ExchangeRate, validateService, dataService);
					return asyncModifyRatePopupThenCheckBoq(entity, value, model, validateService, dataService, url, checkBoqPromise, checkBoqMsgBox, originalRate, originalCurrency);
				}
			};
		}
	]);
})(angular);