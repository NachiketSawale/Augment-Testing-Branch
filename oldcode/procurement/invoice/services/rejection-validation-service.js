/**
 * Created by chi on 09.06.2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceRejectionValidationService',
		['validationService', 'procurementInvoiceRejectionDataService', 'procurementInvoiceHeaderDataService',
			'prcCommonCalculationHelper', 'basicsLookupdataLookupDescriptorService', 'procurementInvoiceRejectionReadonlyProcessor',
			function (validationService, dataService, procurementInvoiceHeaderDataService,
				prcCommonCalculationHelper, basicsLookupdataLookupDescriptorService, procurementInvoiceRejectionReadonlyProcessor) {

				var service = validationService.create('prcInvoiceReject', 'procurement/invoice/reject/schema');
				var parentItem, exchangeRate;

				function recalculateAmountTotal(entity) {
					entity.AmountTotalOc = prcCommonCalculationHelper.round(entity.Quantity * entity.AmountNetOc);
					entity.AmountTotal = prcCommonCalculationHelper.round(entity.Quantity * entity.AmountNet);

					dataService.recalcuteReject();
				}

				service.validateQuantity = function validateQuantity(entity, value) {
					entity.Quantity = value;
					entity.QuantityConfirmed = entity.QuantityAskedFor + value;
					service.validateQuantityConfirmed(entity, entity.QuantityConfirmed);
					recalculateAmountTotal(entity);
					return true;
				};

				service.validateAmountNet = function validateAmountNet(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.AmountNet = value;
					entity.AmountNetOc = prcCommonCalculationHelper.round(value * _exchangeRate);
					recalculateAmountTotal(entity);
					return true;
				};

				service.validateAmountNetOc = function validateAmountNetOc(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.AmountNetOc = value;
					entity.AmountNet = prcCommonCalculationHelper.round(value / _exchangeRate);
					recalculateAmountTotal(entity);
					return true;
				};

				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value) {
					entity.TaxCodeFk = value;
					dataService.recalcuteReject();
					return true;
				};

				service.validateQuantityAskedFor = function validateQuantityAskedFor(entity, value) {
					entity.QuantityAskedFor = value;
					if (entity.QuantityConfirmed === 0) {
						entity.QuantityConfirmed = value;
						service.validateQuantityConfirmed(entity, entity.QuantityConfirmed);
					}
					recalculatePriceAsked(entity);
					// entity.Quantity = entity.QuantityConfirmed - entity.QuantityAskedFor;
					return true;
				};

				service.validateQuantityConfirmed = function validateQuantityConfirmed(entity, value) {
					entity.QuantityConfirmed = value;
					// entity.Quantity = entity.QuantityConfirmed - entity.QuantityAskedFor;
					recalculatePriceConfirmed(entity);
					return true;
				};

				function recalculatePriceAsked(entity, ignoreConfirmed) {
					entity.AskedForTotal = prcCommonCalculationHelper.round(entity.QuantityAskedFor * entity.PriceAskedFor);
					entity.AskedForTotalOc = prcCommonCalculationHelper.round(entity.QuantityAskedFor * entity.PriceAskedForOc);

					entity.NetTotal = prcCommonCalculationHelper.round(entity.ConfirmedTotal - entity.AskedForTotal);
					entity.NetTotalOc = prcCommonCalculationHelper.round(entity.ConfirmedTotalOc - entity.AskedForTotalOc);

					if (entity.PriceConfirmed === 0 && !ignoreConfirmed) {
						entity.PriceConfirmed = entity.PriceAskedFor;
						entity.PriceConfirmedOc = entity.PriceAskedForOc;
					}
					recalculateAmountTotal(entity);
				}

				service.validatePriceAskedFor = function validatePriceAskedFor(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.PriceAskedFor = value;
					entity.PriceAskedForOc = prcCommonCalculationHelper.round(value * _exchangeRate);

					recalculatePriceAsked(entity);

					return true;
				};

				service.validatePriceAskedForOc = function validatePriceAskedForOc(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.PriceAskedForOc = value;
					entity.PriceAskedFor = prcCommonCalculationHelper.round(value / _exchangeRate);

					recalculatePriceAsked(entity);

					return true;
				};

				function recalculatePriceConfirmed(entity) {
					entity.ConfirmedTotal = prcCommonCalculationHelper.round(entity.QuantityConfirmed * entity.PriceConfirmed);
					entity.ConfirmedTotalOc = prcCommonCalculationHelper.round(entity.QuantityConfirmed * entity.PriceConfirmedOc);

					entity.NetTotal = prcCommonCalculationHelper.round(entity.ConfirmedTotal - entity.AskedForTotal);
					entity.NetTotalOc = prcCommonCalculationHelper.round(entity.ConfirmedTotalOc - entity.AskedForTotalOc);
					recalculateAmountTotal(entity);
				}

				service.validatePriceConfirmed = function validatePriceConfirmed(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.PriceConfirmed = value;
					entity.PriceConfirmedOc = prcCommonCalculationHelper.round(value * _exchangeRate);

					recalculatePriceConfirmed(entity);
					return true;
				};

				service.validatePriceConfirmedOc = function validatePriceConfirmedOc(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.PriceConfirmedOc = value;
					entity.PriceConfirmed = prcCommonCalculationHelper.round(value / _exchangeRate);

					recalculatePriceConfirmed(entity);
					return true;
				};

				service.validateNetTotalOc = function validateNetTotalOc(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.QuantityConfirmed = 0;
					entity.QuantityAskedFor = -1;
					// entity.Quantity = 1;
					entity.NetTotalOc = value;
					entity.PriceAskedForOc = value;
					entity.NetTotal = prcCommonCalculationHelper.round(value / _exchangeRate);
					entity.PriceAskedFor = entity.NetTotal;
					recalculateAmountTotal(entity);
					// service.validateQuantity(entity,1);
					return true;
				};

				service.validateNetTotal = function validateNetTotal(entity, value) {
					var _exchangeRate = getExchangeRate();
					entity.QuantityConfirmed = 0;
					entity.QuantityAskedFor = -1;
					// entity.Quantity = 1;
					entity.NetTotal = value;
					entity.PriceAskedFor = value;
					entity.NetTotalOc = prcCommonCalculationHelper.round(value * _exchangeRate);
					entity.PriceAskedForOc = entity.NetTotalOc;
					recalculateAmountTotal(entity);
					// service.validateQuantity(entity,1);
					return true;
				};

				service.validateInvRejectFk = function validateInvRejectFk(entity, value) {
					if (value !== null) {
						var rejection = basicsLookupdataLookupDescriptorService.getLookupItem('InvRejectLookupV', value);

						if (rejection) {
							entity.Quantity = rejection.Quantity;
							entity.UomFk = rejection.UomFk;
							entity.Description = rejection.Description;
							entity.TaxCodeFk = rejection.TaxCodeFk;
							entity.CommentText = rejection.CommentText;
							entity.Remark = rejection.Remark;
							entity.QuantityAskedFor = rejection.QuantityAskedFor;
							entity.QuantityConfirmed = rejection.QuantityConfirmed;
							entity.Itemreference = rejection.Itemreference;
							entity.PriceAskedForOc = rejection.PriceAskedForOc * -1;
							entity.PriceConfirmedOc = rejection.PriceConfirmedOc * -1;
							entity.PriceAskedFor = rejection.PriceAskedFor * -1;
							entity.PriceConfirmed = rejection.PriceConfirmed * -1;
							entity.AmountNet = rejection.AmountNet * -1;
							entity.AmountNetOc = rejection.AmountNetOc * -1;
							entity.InvRejectionReasonFk = rejection.InvRejectionReasonFk;
							recalculatePriceAsked(entity, true);
						}

						procurementInvoiceRejectionReadonlyProcessor.setRowReadOnly(entity, true);
					}

					return true;
				};

				service.validateInvRejectionReasonFk = function validateInvRejectFk(entity, value) {
					if (value !== null && entity.InvRejectionReasonFk !== value) {
						var rejectionReason = basicsLookupdataLookupDescriptorService.getLookupItem('InvRejection', value);
						if (rejectionReason) {
							entity.Description = rejectionReason.DescriptionInfo.Translated;
						}
					}
					return true;
				};

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(e, item) {
					service.validateTaxCodeFk(item, item.TaxCodeFk);
				}

				function getExchangeRate() {
					parentItem = procurementInvoiceHeaderDataService.getSelected();
					exchangeRate = 0;
					if (parentItem && parentItem.Id) {
						exchangeRate = parentItem.ExchangeRate;
					}
					return exchangeRate;
				}

				dataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);

})(angular);
