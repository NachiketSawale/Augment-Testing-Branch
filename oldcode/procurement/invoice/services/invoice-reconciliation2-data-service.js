/**
 * Created by wwa on 12/10/2015.
 */
(function (angular) {
	'use strict';
	// var module = angular.module('procurement.invoice');
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceReconciliation2DataService',
		['procurementInvoiceHeaderDataService', '$translate', '$q', 'PlatformMessenger', 'basicsLookupdataLookupDescriptorService', 'prcCommonCalculationHelper', function (parentService, $translate, $q, PlatformMessenger, basicsLookupdataLookupDescriptorService, prcCommonCalculationHelper) {

			var service = {}, self = this;

			service.refreshGrid = new PlatformMessenger();

			self.currentItem = null;
			service.parentService = parentService;
			service.registerListLoaded = function registerListLoaded(callBackFn) {
				service.refreshGrid.register(callBackFn);
			};

			service.unregisterListLoaded = function unregisterListLoaded(callBackFn) {
				service.refreshGrid.unregister(callBackFn);
			};

			service.getList = function getList() {
				var parentItem = parentService.getSelected() || {};

				var amountNet = parentItem.AmountNet;
				var amountGross = parentItem.AmountGross;
				var amountNetOc = parentItem.AmountNetOc;
				var amountVat = parentItem.AmountVat;
				var amountVatOc = parentItem.AmountVatOc;
				var amountGrossOc = parentItem.AmountGrossOc;
				var billingSchemaFk = parentItem.BillingSchemaFk;
				if (billingSchemaFk) {
					var billSchemas = basicsLookupdataLookupDescriptorService.getData('PrcConfig2BSchema');
					var billSchema = _.find(billSchemas, {Id: billingSchemaFk});
					if (billSchema && billSchema.IsChained) {
						amountNet = parentItem.TotalPerformedNet;
						amountGross = parentItem.TotalPerformedGross;
						amountVat = prcCommonCalculationHelper.round(amountGross - amountNet);
						amountNetOc = prcCommonCalculationHelper.round(amountNet * parentItem.ExchangeRate);
						amountGrossOc = prcCommonCalculationHelper.round(amountGross * parentItem.ExchangeRate);
						amountVatOc = prcCommonCalculationHelper.round(amountGrossOc - amountNetOc);
					}
				}

				var list = [], index = 0;
				list.push({
					Id: index++, Type: $translate.instant('cloud.common.entityAmount'),
					Net: amountNet, Vat: amountVat, Gross: amountGross,
					NetOc: amountNetOc, VatOc: amountVatOc, GrossOc: amountGrossOc
				});
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.invoice.header.fromPES'),
					Net: parentItem.AmountNetPes,
					Vat: parentItem.AmountVatPes,
					Gross: parentItem.AmountGrossPes,
					NetOc: parentItem.AmountNetPesOc,
					VatOc: parentItem.AmountVatPesOc,
					GrossOc: parentItem.AmountGrossPesOc
				});
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.invoice.header.fromContract'),
					Net: parentItem.AmountNetContract,
					Vat: parentItem.AmountVatContract,
					Gross: parentItem.AmountGrossContract,
					NetOc: parentItem.AmountNetContractOc,
					VatOc: parentItem.AmountVatContractOc,
					GrossOc: parentItem.AmountGrossContractOc

				});
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.invoice.header.fromOther'),
					Net: parentItem.AmountNetOther,
					Vat: parentItem.AmountVatOther,
					Gross: parentItem.AmountGrossOther,
					NetOc: parentItem.AmountNetOtherOc,
					VatOc: parentItem.AmountVatOtherOc,
					GrossOc: parentItem.AmountGrossOtherOc
				});
				/** @namespace parentItem.FromBillingSchemaVat */
				/** @namespace parentItem.FromBillingSchemaNet */
				/** @namespace parentItem.FromBillingSchemaGross */
				/** @namespace parentItem.FromBillingSchemaNetOc */
				/** @namespace parentItem.FromBillingSchemaVatOc */
				/** @namespace parentItem.FromBillingSchemaGrossOc */
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.invoice.header.fromBillingSchema'),
					Net: parentItem.FromBillingSchemaNet,
					Vat: parentItem.FromBillingSchemaVat,
					Gross: parentItem.FromBillingSchemaGross,
					NetOc: parentItem.FromBillingSchemaNetOc,
					VatOc: parentItem.FromBillingSchemaVatOc,
					GrossOc: parentItem.FromBillingSchemaGrossOc
				});
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.invoice.header.rejections'),
					Net: parentItem.AmountNetReject,
					Vat: parentItem.AmountVatReject,
					Gross: parentItem.AmountGrossReject,
					NetOc: parentItem.AmountNetRejectOc,
					VatOc: parentItem.AmountVatRejectOc,
					GrossOc: parentItem.AmountGrossRejectOc
				});
				// noinspection JSUnusedAssignment
				list.push({
					Id: index++,
					Type: $translate.instant('procurement.invoice.header.balance'),
					Net: parentItem.AmountNetBalance,
					Vat: parentItem.AmountVatBalance,
					Gross: parentItem.AmountGrossBalance,
					NetOc: parentItem.AmountNetBalanceOc,
					VatOc: parentItem.AmountVatBalanceOc,
					GrossOc: parentItem.AmountGrossBalanceOc
				});

				return list;
			};

			service.getSelected = function getSelected() {
				return self.currentItem;
			};

			service.setSelected = function setSelected(item) {
				self.currentItem = item;
				return $q.when(item);
			};

			function onParentItemChanged() {
				service.refreshGrid.fire();
			}

			parentService.registerSelectionChanged(onParentItemChanged);
			parentService.registerAmountNetValueChanged(onParentItemChanged);

			service.hasSelection = function hasSelection() {
				return !_.isNull(self.currentItem) && !_.isUndefined(self.currentItem);
			};
			// fixed issue #135153
			service.getEntityTranslationId = function getEntityTranslationId(){
				return null;
			};

			return service;
		}]);
})(angular);