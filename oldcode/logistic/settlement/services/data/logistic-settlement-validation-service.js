/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementValidationService
	 * @description provides validation methods for logistic settlement  entities
	 */
	angular.module(moduleName).service('logisticSettlementValidationService', LogisticSettlementValidationService);

	LogisticSettlementValidationService.$inject = ['$http', '$injector', '$q', 'platformDataValidationService',
		'logisticSettlementDataService', 'logisticSettlementItemDataService'];


	function LogisticSettlementValidationService($http, $injector, $q, platformDataValidationService,
		logisticSettlementDataService, logisticSettlementItemDataService) {

		let self = this;
		return {
			asyncValidateBusinesspartnerFk: asyncValidateBusinessPartnerFk,
			validateExchangeRate: validateExchangeRate,
			asyncValidateCustomerFk: asyncValidateCustomerFk,
			validateCurrencyFk: validateCurrencyFk,
			asyncValidateCurrencyFk: asyncValidateCurrencyFk,
			asyncValidateProjectFk: asyncValidateProjectFk,
			asyncValidatePostingDate: asyncValidatePostingDate
		};

		function asyncValidateBusinessPartnerFk(entity, value) {
			return applyAsyncFieldTest({Field2Validate: 1, NewIntValue: value, Settlement: entity});
		}

		function asyncValidateCustomerFk(entity, value) {
			return applyAsyncFieldTest({Field2Validate: 3, NewIntValue: value, Settlement: entity});
		}

		function asyncValidatePostingDate(entity, value , model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticSettlementDataService);
			let data = {
				PostingDate: value,
				SettlementId: entity.Id
			};
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/settlement/validatepostingdate',data).then(function (response) {
				if (response.data) {
					return platformDataValidationService.finishAsyncValidation({
						valid: response.data.IsValid,
						error: 'The posting date is outside of the selected period',
						apply: true,
						invalidFields: [model]
					}, entity, value, model, asyncMarker, self, logisticSettlementDataService);
				}
			});
			return asyncMarker.myPromise;
		}

		function applyAsyncFieldTest(validationSpec) {
			var defer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'logistic/settlement/validate', validationSpec).then(function (result) {
				if (!result.data.ValidationResult) {
					defer.resolve({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'project.main.errors.thisIsAnUnknwonBusinessPartner',
						error$tr$param: {}
					});
				} else {
					result.data.Settlement.VatGroupFk = result.data.CustomersBpdVatGroupId;
					logisticSettlementDataService.takeOver(result.data.Settlement);
					defer.resolve(true);
				}
			});

			return defer.promise;
		}

		function validateExchangeRate(entity, value) {
			logisticSettlementItemDataService.recalculatePricePortions(value);

			entity.PriceTotalQty = _.sumBy(logisticSettlementItemDataService.getList(), function(si) { return si.PriceTotalQty; });
			logisticSettlementDataService.markItemAsModified(entity);

			return {
				apply: true,
				valid: true
			};
		}

		function getAsyncCurrentRate(foreingCurrencyFk, projectFk) {
			var exchangeRateUri = globals.webApiBaseUrl + 'logistic/settlement/defaultrate';
			return $http({
				method: 'Post',
				url: exchangeRateUri,
				params: {
					CurrencyForeignFk: foreingCurrencyFk,
					ProjectFk: !_.isUndefined(projectFk)? projectFk : null
				}
			}).then(function (response) {
				return response.data;
			});
		}

		function validateCurrencyFk(entity, value) {
			logisticSettlementDataService.customizedProcessItem(entity, value);
			return true;
		}

		function setExchangeRate(entity, exchangeRate) {
			entity.ExchangeRate = exchangeRate;
			validateExchangeRate(entity, entity.ExchangeRate, 'ExchangeRate');
		}

		function asyncReloadExchangeRate(entity, currencyFk, projectFk) {
			return currencyFk !== null ?
				getAsyncCurrentRate(currencyFk,projectFk).then(function (exchangeRate) {
					setExchangeRate(entity, exchangeRate === null? 1: exchangeRate);
					return true;
				}):
				$q(function (res) {
					setExchangeRate(entity,1);
					return res(true);
				});
		}

		function asyncValidateCurrencyFk(entity, value){
			return asyncReloadExchangeRate(entity, value, entity.ProjectFk);
		}

		function asyncValidateProjectFk(entity, value){
			return asyncReloadExchangeRate(entity, entity.CurrencyFk, value);
		}
	}

})(angular);
