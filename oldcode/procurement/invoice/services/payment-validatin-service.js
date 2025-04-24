/**
 * Created by ltn on 11/18/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.invoice';
	/**
     * @ngdoc service
     * @name procurementInvoicePaymentValidationService
     * @description provides validation methods for a InvoicePayment
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoicePaymentValidationService',
		['$injector', 'platformDataValidationService','validationService', 'procurementInvoicePaymentDataService',
			function ($injector, platformDataValidationService, validationService,procurementInvoicePaymentDataService) {
				var service = validationService.create('prcInvoicePayment', 'procurement/invoice/payment/schema');

				var self = this;

				function getVatPercent(entity, taxCodeFk) {
					if (!taxCodeFk) {
						taxCodeFk = entity.TaxCodeFk;
					}
					return  procurementInvoicePaymentDataService.getVatPercentWithTaxCodeMatrix(taxCodeFk);
				}

				function checkForNegativeValue(entity, value, model, func) {
					var result = true;
					var checkIsActiveOpt = false; // at the moment we don't want to check for negative values, they are allowed
					if (value < 0 && checkIsActiveOpt) {
						result = platformDataValidationService.createErrorObject('cloud.common.Error_ValueOutOfRange');
					} else if (_.isFunction(func)) {
						func(entity, value);
					}
					return platformDataValidationService.finishValidation(result, entity, value, model, self, procurementInvoicePaymentDataService);
				}

				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value) {
					var vatPercent = getVatPercent(entity, value);
					entity.AmountVat = entity.Amount_Net * (vatPercent / 100);// jshint ignore : line
					entity.Amount = entity.Amount_Net + entity.AmountVat;// jshint ignore : line
					entity.DiscountAmountVat = entity.DiscountAmountNet * (vatPercent / 100);
					entity.DiscountAmount = entity.DiscountAmountNet + entity.DiscountAmountVat;
				};

				service.validateAmount_Net = function validateAmount_Net(entity, value, model) {// jshint ignore : line
					return checkForNegativeValue(entity, value, model, function () {
						var vatPercent = getVatPercent(entity);
						entity.AmountVat = value * (vatPercent / 100);
						entity.Amount = value * (1 + (vatPercent / 100));
						entity[model] = value;
						procurementInvoicePaymentDataService.firePaymentsAmountTotalUpdate(entity);
					});
				};

				service.validateAmount = function validateAmount(entity, value, model) {
					return checkForNegativeValue(entity, value, model, function () {
						var vatPercent = getVatPercent(entity);
						entity.Amount_Net = value / (1 + (vatPercent / 100));// jshint ignore : line
						entity.AmountVat = value - entity.Amount_Net;// jshint ignore : line

						entity[model] = value;
						procurementInvoicePaymentDataService.firePaymentsAmountTotalUpdate(entity);
					});
				};

				service.validateDiscountAmountNet = function validateDiscountAmountNet(entity, value, model) {
					return checkForNegativeValue(entity, value, model, function () {
						var vatPercent = getVatPercent(entity);
						entity.DiscountAmountVat = value * (vatPercent / 100);
						entity.DiscountAmount = value * (1 + (vatPercent / 100));
						entity[model] = value;
						procurementInvoicePaymentDataService.firePaymentsDiscountAmountTotalUpdate(entity);
					});
				};

				service.validateDiscountAmount = function validateDiscountAmount(entity, value, model) {
					return checkForNegativeValue(entity, value, model, function () {
						var vatPercent = getVatPercent(entity);
						entity.DiscountAmountNet = value / (1 + (vatPercent / 100));
						entity.DiscountAmountVat = value - entity.DiscountAmountNet;

						entity[model] = value;
						procurementInvoicePaymentDataService.firePaymentsDiscountAmountTotalUpdate(entity);
					});
				};

				return service;
			}
		]);

})(angular);