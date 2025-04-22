(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';
	angular.module(moduleName).factory('salesBillingReconciliation2DataService',
		['_', 'salesBillingService', '$translate', '$q', 'PlatformMessenger','basicsLookupdataLookupDescriptorService','prcCommonCalculationHelper',function (_, parentService, $translate, $q, PlatformMessenger,basicsLookupdataLookupDescriptorService,prcCommonCalculationHelper) {

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
				var parentItem = parentService.getSelected();
				if(!parentItem) {
					return  [];
				}
				else {
					var amountNet = parentItem.AmountNet;
					var amountNetOc = parentItem.AmountNetOc;
					var amountGross = parentItem.AmountGross;
					var amountGrossOc = parentItem.AmountGrossOc;
					// noinspection JSUnusedAssignment
					var fromBillingSchemaNet = self.FromBillingSchema.Net || parentItem.FromBillingSchemaNet;
					var fromBillingSchemaVat = self.FromBillingSchema.Vat || parentItem.FromBillingSchemaVat;
					var fromBillingSchemaNetOc = self.FromBillingSchema.NetOc || parentItem.FromBillingSchemaNetOc;
					var fromBillingSchemaVatOc = self.FromBillingSchema.VatOc || parentItem.FromBillingSchemaVatOc;

					var amountVat = (_.isUndefined(amountGross) || _.isUndefined(amountNet)) ? undefined : prcCommonCalculationHelper.round(amountGross - amountNet);
					var amountVatOc = (_.isUndefined(amountGrossOc) || _.isUndefined(amountNetOc)) ? undefined : prcCommonCalculationHelper.round(amountGrossOc - amountNetOc);

					var fromBillingSchemaGross = (_.isUndefined(fromBillingSchemaNet) || _.isUndefined(fromBillingSchemaVat)) ? undefined : prcCommonCalculationHelper.round(fromBillingSchemaNet + fromBillingSchemaVat);
					var fromBillingSchemaGrossOc = (_.isUndefined(fromBillingSchemaNetOc) || _.isUndefined(fromBillingSchemaVatOc)) ? undefined : prcCommonCalculationHelper.round(fromBillingSchemaNetOc + fromBillingSchemaVatOc);


					var list = [], index = 0;
					list.push({
						Id: index++, Type: $translate.instant('cloud.common.entityAmount'),
						Net: amountNet, Vat: amountVat, Gross: amountGross,
						NetOc: amountNetOc, VatOc: amountVatOc, GrossOc: amountGrossOc
					});

					list.push({
						Id: index++, Type: $translate.instant('procurement.invoice.header.fromBillingSchema'),
						Net: fromBillingSchemaNet, Vat: fromBillingSchemaVat, Gross: fromBillingSchemaGross,
						NetOc: fromBillingSchemaNetOc, VatOc: fromBillingSchemaVatOc, GrossOc: fromBillingSchemaGrossOc
					});
					// noinspection JSUnusedAssignment
					list.push({
						Id: index++, Type: $translate.instant('procurement.invoice.header.balance'),
						Net: prcCommonCalculationHelper.round(amountNet - fromBillingSchemaNet), Vat: prcCommonCalculationHelper.round(amountVat - fromBillingSchemaVat), Gross: prcCommonCalculationHelper.round(amountGross - fromBillingSchemaGross),
						NetOc: prcCommonCalculationHelper.round(amountNetOc - fromBillingSchemaNetOc), VatOc: prcCommonCalculationHelper.round(amountVatOc - fromBillingSchemaVatOc), GrossOc: prcCommonCalculationHelper.round(amountGrossOc - fromBillingSchemaGrossOc)
					});

					return list;
				}
			};

			service.getSelected = function getSelected() {
				return self.currentItem;
			};

			service.setSelected = function setSelected(item) {
				self.currentItem = item;
				return $q.when(item);
			};

			function onParentItemChanged(e, args) {
				if (args) {
					self.FromBillingSchema = {
						Net: args.FromBillingSchemaNet,
						Vat: args.FromBillingSchemaVat,
						NetOc: args.FromBillingSchemaNetOc,
						VatOc: args.FromBillingSchemaVatOc
					};
				}
				service.refreshGrid.fire();
			}

			parentService.registerSelectionChanged(onParentItemChanged);
			parentService.registerAmountNetValueChanged(onParentItemChanged);

			service.hasSelection = function hasSelection() {
				return !_.isNull(self.currentItem) && !_.isUndefined(self.currentItem);
			};

			return service;
		}]);
})(angular);
