/**
 * Created by wuj on 4/30/2015.
 */
/* global _ */

(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular */

	'use strict';

	angular.module('procurement.invoice').factory('procurementInvoiceHeaderReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'procurementInvoiceNumberGenerationSettingsService',
			'basicsLookupdataLookupDescriptorService',
			function (commonReadOnlyProcessor, moduleContext, platformRuntimeDataService, lookupDescriptorService, procurementInvoiceNumberGenerationSettingsService, basicsLookupdataLookupDescriptorService) {

				var readOnlyFields = ['Code', 'Description', 'ProgressId', 'InvTypeFk', 'BillingSchemaFk', 'BusinessPartnerFk', 'SubsidiaryFk',
					'SupplierFk', 'DateInvoiced', 'DateReceived', 'Reference', 'DateDelivered', 'DateDeliveredFrom', 'ReferenceStructured', 'TaxCodeFk',
					'ExchangeRate', 'AmountNet', 'AmountGross', 'AmountGrossOc', 'AmountNetOc', 'PrcConfigurationFk', 'CurrencyFk',
					'CompanyDeferalTypeFk', 'DateDeferalStart', 'PrcStructureFk', 'ControllingUnitFk', 'BankFk',
					'BasAccassignBusinessFk', 'BasAccassignControlFk', 'BasAccassignAccountFk', 'BasAccassignConTypeFk', 'PesHeaderFk', 'SalesTaxMethodFk'];
				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InvHeaderDto',
					moduleSubModule: 'Procurement.Invoice',
					readOnlyFields: readOnlyFields
				});

				var self = this, invStatuses, itemStatus, invTypes, readOnlyStatus;

				moduleContext.init();

				service.handlerItemReadOnlyStatus = function (item) {
					itemStatus = self.getItemStatus(item);
					if (itemStatus) {
						readOnlyStatus = itemStatus.IsReadOnly;
					} else {
						readOnlyStatus = false;
					}
					service.setRowReadOnly(item, readOnlyStatus);
					platformRuntimeDataService.readonly(item, [{field: 'Remark', readonly: false}]);
					return readOnlyStatus;
				};

				self.getItemStatus = function getItemStatus(item) {
					invStatuses = lookupDescriptorService.getData('invstatus');
					return _.find(invStatuses, {Id: item.InvStatusFk});
				};

				self.getItemTypeFlg = function getItemStatus(item) {
					invTypes = lookupDescriptorService.getData('invtype');
					var invType = _.find(invTypes, {Id: item.InvTypeFk});
					if (invType) {
						return !invType.IsProgress;
					}
					return false;
				};

				self.getBillSchema = function getItemStatus(item) {
					var billSchemas = lookupDescriptorService.getData('PrcConfig2BSchema');
					var BillingSchema = _.find(billSchemas, {Id: item.BillingSchemaFk});
					return !!(BillingSchema && BillingSchema.IsChained);

				};

				self.hasToGenerateCode = function hasToGenerateCode(item) {
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: item.PrcConfigurationFk});
					if (config) {
						return procurementInvoiceNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
					}
					return false;
				};

				service.getCellEditable = function getCellEditable(item, model) {
					var _itemStatus = self.getItemStatus(item);
					var statusWithEditRight = true;
					var invStatusEditRight = basicsLookupdataLookupDescriptorService.getData('InvStatusEditRight');
					if (invStatusEditRight) {
						statusWithEditRight = _.find(invStatusEditRight, {Id: item.InvStatusFk});
					}
					if (model === 'CompanyDeferalTypeFk' || model === 'DateDeferalStart') {
						return self.getItemTypeFlg(item);
					}
					if (readOnlyFields.indexOf(model) !== -1) {
						if (model === 'PesHeaderFk') {
							var pesEditRightStatusList = basicsLookupdataLookupDescriptorService.getData('InvStatusEditRightToPes');
							var pesEditRightStatus = _.find(pesEditRightStatusList, {Id: item.InvStatusFk});
							if (!pesEditRightStatus) {
								return false;
							}
						} else if (!statusWithEditRight) {
							return false;
						}
					}
					if (model === 'ControllingUnitFk' || model === 'PrcStructureFk') {
						/** @namespace _itemStatus.ToBeVerifiedBL */
						return !_itemStatus.ToBeVerifiedBL;
					}
					if (model === 'SalesTaxMethodFk') {
						return !(item.ConHeaderFk !== null || item.PesHeaderFk !== null);
					}

					var isVirtual = _itemStatus.IsVirtual;
					switch (model) {
						case 'Description':
						case 'InvTypeFk':
						case 'BusinessPartnerFk':
						case 'SupplierFk':
						case 'DateInvoiced':
						case 'Reference':
						case 'DateDelivered':
						case 'DateDeliveredFrom':
						case 'ReferenceStructured':
						case 'TaxCodeFk':
						case 'AmountNet':
						case 'AmountNetOc':
						case 'AmountGross':
						case 'AmountGrossOc':
						case 'TotalPerformedNet':
						case 'TotalPerformedGross':
							return !isVirtual;
						case 'DateReceived':
							return !isVirtual && item.Version === 0;
						case 'Code':
							var hasToGennerateCode = self.hasToGenerateCode(item);
							return !isVirtual && item.Version === 0 && !hasToGennerateCode;
						case 'ProgressId':
							return !isVirtual && self.getBillSchema(item);
						case 'PrcPackageFk':
						case 'BankFk':
						case 'SubsidiaryFk':
							if(!_.isNil(item['SubsidiaryFromBpDialog'])){
								return !isVirtual;
							}
							return !!item.BusinessPartnerFk && !isVirtual;
						case 'ExchangeRate':
							return moduleContext.companyCurrencyId !== item.CurrencyFk;
						case 'PrcConfigurationFk':
							return item.Version === 0 && !isVirtual;
						case 'BasAccassignBusinessFk':
						case 'BasAccassignControlFk':
						case 'BasAccassignAccountFk':
						case 'BasAccassignConTypeFk':
						case 'CurrencyFk':
							return item.ConHeaderFk === null && !isVirtual;
						case 'BillingSchemaFk':
							return item.ConHeaderFk === null && !isVirtual;
						default :
							return true;
					}
				};

				return service;
			}]);

})(angular);