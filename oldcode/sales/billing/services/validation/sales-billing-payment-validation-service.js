/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingPaymentValidationService
	 * @description provides validation methods for billing payment entities
	 */
	angular.module(moduleName).factory('salesBillingPaymentValidationService', ['_', '$injector', 'platformDataValidationService', 'salesBillingPaymentService', 'salesCommonValidationServiceProvider',
		'$q',
		'$http',
		'platformRuntimeDataService',
		'prcCommonCalculationHelper',
		function (_, $injector, platformDataValidationService, salesBillingPaymentService, salesCommonValidationServiceProvider,
			$q,
			$http,
			platformRuntimeDataService,
			prcCommonCalculationHelper) {
			var service = salesCommonValidationServiceProvider.getInstance(salesBillingPaymentService);

			var self = this;
			var parentService = salesBillingPaymentService.parentService();
			var updateExchangeRateUrl = globals.webApiBaseUrl + 'sales/billing/payment/updateExchangeRate';

			function getVatPercent(entity, taxCodeFk) {
				var taxCodeMatrix = null;
				var parentSelected = parentService.getSelected();
				var taxCodeId = taxCodeFk || entity.TaxCodeFk;
				if (parentSelected.VatGroupFk > 0) {
					var taxCodeMatrixList = $injector.get('basicsLookupdataLookupDescriptorService').getData('Sales_TaxCodeMatrix');
					taxCodeMatrix = _.find(taxCodeMatrixList, {
						TaxCodeFk: taxCodeId,
						VatGroupFk: parentSelected.VatGroupFk
					});
				}

				if (_.isObject(taxCodeMatrix) && taxCodeMatrix !== null) {
					return taxCodeMatrix.VatPercent * 1.0;
				} else {
					var taxCodes = $injector.get('basicsLookupdataLookupDescriptorService').getData('TaxCode');
					var taxCode = _.find(taxCodes, {Id: taxCodeId}) || null;
					return taxCode === null ? 0 : taxCode.VatPercent * 1.0;
				}
			}

			function getExchangeRate(item) {
				if (item.CurrencyFk) {
					return item.ExchangeRate;
				}
				var parentSelected = parentService.getSelected();
				return parentSelected.ExchangeRate;
			}

			function checkForNegativeValue(entity, value, model, func) {
				var result = true;
				var checkIsActiveOpt = false; // at the moment we don't want to check for negative values, they are allowed
				if (value < 0 && checkIsActiveOpt) {
					result = platformDataValidationService.createErrorObject('cloud.common.Error_ValueOutOfRange');
				} else if (_.isFunction(func)) {
					func(entity, value);
				}
				return platformDataValidationService.finishValidation(result, entity, value, model, self, salesBillingPaymentService);
			}

			service.validateTaxCodeFk = function validateTaxCodeFk(entity, value) {
				var vatPercent = getVatPercent(entity, value);
				var rate = getExchangeRate(entity);
				entity.AmountVat = entity.AmountNet * (vatPercent / 100);
				entity.Amount = entity.AmountNet + entity.AmountVat;
				entity.AmountVatOc = entity.AmountVat * rate;
				entity.AmountOc = entity.Amount * rate;

				entity.DiscountAmountVat = entity.DiscountAmountNet * (vatPercent / 100);
				entity.DiscountAmount = entity.DiscountAmountNet + entity.DiscountAmountVat;
				entity.DiscountAmountVatOc = entity.DiscountAmountVat * rate;
				entity.DiscountAmountOc = entity.DiscountAmount * rate;
			};

			service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
				return salesBillingPaymentService.setAsyncExchangeRate(entity, value, model, updateExchangeRateUrl, true);
			};

			service.validateAmountNet = function validateAmountNet(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.AmountVat = value * (vatPercent / 100);
					entity.Amount = value * (1 + (vatPercent / 100));

					entity.AmountNetOc = value * rate;
					entity.AmountVatOc = entity.AmountVat * rate;
					entity.AmountOc = entity.Amount * rate;

					entity[model] = value;
					salesBillingPaymentService.firePaymentsAmountTotalUpdate(entity);
				});
			};

			service.validateAmount = function validateAmount(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.AmountNet = value / (1 + (vatPercent / 100));
					entity.AmountVat = value - entity.AmountNet;

					entity.AmountOc = value * rate;
					entity.AmountNetOc = entity.AmountNet * rate;
					entity.AmountVatOc = entity.AmountVat * rate;

					entity[model] = value;
					salesBillingPaymentService.firePaymentsAmountTotalUpdate(entity);
				});
			};

			service.validateDiscountAmountNet = function validateDiscountAmountNet(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.DiscountAmountVat = value * (vatPercent / 100);
					entity.DiscountAmount = value * (1 + (vatPercent / 100));

					entity.DiscountAmountNetOc = value * rate;
					entity.DiscountAmountVatOc = entity.DiscountAmountVat * rate;
					entity.DiscountAmountOc = entity.DiscountAmount * rate;

					entity[model] = value;
					salesBillingPaymentService.firePaymentsDiscountAmountTotalUpdate(entity);
				});
			};

			service.validateDiscountAmount = function validateDiscountAmount(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.DiscountAmountNet = value / (1 + (vatPercent / 100));
					entity.DiscountAmountVat = value - entity.DiscountAmountNet;

					entity.DiscountAmountOc = value * rate;
					entity.DiscountAmountNetOc = entity.DiscountAmountNet * rate;
					entity.DiscountAmountVatOc = entity.DiscountAmountVat * rate;

					entity[model] = value;
					salesBillingPaymentService.firePaymentsDiscountAmountTotalUpdate(entity);
				});
			};

			service.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, value, model) {
				if (!value) {
					platformRuntimeDataService.readonly(entity, [{field: 'ExchangeRate', readonly: true}]);
					entity.ExchangeRate = null;
					return $q.resolve(true);
				}
				var parentSelected = parentService.getSelected();
				entity.ProjectFk = parentSelected.ProjectFk;
				return salesBillingPaymentService.setAsyncExchangeRateByCurrency(entity, value, model, updateExchangeRateUrl, true);
			};

			service.validateAmountNetOc = function validateAmountNetOc(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.AmountVatOc = value * (vatPercent / 100);
					entity.AmountOc = value * (1 + (vatPercent / 100));

					entity.AmountNet = rate !== 0 ? prcCommonCalculationHelper.round(value / rate) : 0;
					entity.AmountVat = rate !== 0 ? prcCommonCalculationHelper.round(entity.AmountVatOc / rate) : 0;
					entity.Amount = rate !== 0 ? prcCommonCalculationHelper.round(entity.AmountOc / rate) : 0;
				});
			};

			service.validateAmountOc = function validateAmountOc(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.AmountNetOc = value / (1 + (vatPercent / 100));
					entity.AmountVatOc = value - entity.AmountNetOc;

					entity.Amount = rate !== 0 ? prcCommonCalculationHelper.round(value / rate) : 0;
					entity.AmountNet = rate !== 0 ? prcCommonCalculationHelper.round(entity.AmountNetOc / rate) : 0;
					entity.AmountVat = rate !== 0 ? prcCommonCalculationHelper.round(entity.AmountVatOc / rate) : 0;

					entity[model] = value;
					salesBillingPaymentService.firePaymentsAmountTotalUpdate(entity);
				});
			};

			service.validateDiscountAmountNetOc = function validateDiscountAmountNet(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.DiscountAmountVatOc = value * (vatPercent / 100);
					entity.DiscountAmountOc = value * (1 + (vatPercent / 100));

					entity.AmountDiscountAmountNet = rate !== 0 ? prcCommonCalculationHelper.round(value / rate) : 0;
					entity.DiscountAmountVat = rate !== 0 ? prcCommonCalculationHelper.round(entity.DiscountAmountVatOc / rate) : 0;
					entity.DiscountAmount = rate !== 0 ? prcCommonCalculationHelper.round(entity.DiscountAmountOc / rate) : 0;
				});
			};

			service.validateDiscountAmountOc = function validateDiscountAmountOc(entity, value, model) {
				return checkForNegativeValue(entity, value, model, function () {
					var vatPercent = getVatPercent(entity);
					var rate = getExchangeRate(entity);
					entity.DiscountAmountNetOc = value / (1 + (vatPercent / 100));
					entity.DiscountAmountVatOc = value - entity.DiscountAmountNetOc;

					entity.DiscountAmount = rate !== 0 ? prcCommonCalculationHelper.round(value / rate) : 0;
					entity.DiscountAmountNet = rate !== 0 ? prcCommonCalculationHelper.round(entity.DiscountAmountNetOc) / rate : 0;
					entity.DiscountAmountVat = rate !== 0 ? prcCommonCalculationHelper.round(entity.DiscountAmountVatOc) / rate : 0;

					entity[model] = value;
					salesBillingPaymentService.firePaymentsDiscountAmountTotalUpdate(entity);
				});
			};

			return service;
		}
	]);
})();
