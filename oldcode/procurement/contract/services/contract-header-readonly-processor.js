/**
 * Created by wwa on 7/8/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.contract';
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementContractHeaderReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', 'basicsLookupdataLookupDescriptorService', 'contractHeaderPurchaseOrdersDataService',
			function (commonReadOnlyProcessor, moduleContext, basicsLookupdataLookupDescriptorService, contractHeaderPurchaseOrdersDataService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					uiStandardService: 'procurementContractHeaderUIStandardService',
					readOnlyFields: ['ExchangeRate', 'BusinessPartnerFk', 'ContactFk', 'SubsidiaryFk', 'SupplierFk', 'BusinessPartner2Fk', 'Contact2Fk', 'Subsidiary2Fk', 'PaymentTermPaFk',
						'PaymentTermFiFk','PaymentTermAdFk', 'Supplier2Fk', 'LeadTimeExtra', 'ProjectFk', 'PackageFk', 'PrcHeaderEntity.ConfigurationFk',
						'TaxCodeFk', 'ContracttypeFk', 'IncotermFk', 'Code', 'CompanyInvoiceFk', 'ContractHeaderFk','ProjectChangeFk','CodeQuotation','IsInvAccountChangeable',
						'BasCurrencyFk', 'MaterialCatalogFk', 'PrcCopyModeFk', 'BankFk', 'BoqWicCatFk', 'BoqWicCatBoqFk']
				});

				var itemStatus, readOnlyStatus, prcConfigurations;

				service.handlerItemReadOnlyStatus = function (item) {
					itemStatus = self.getItemStatus(item); // jshint ignore:line
					if (itemStatus) {
						readOnlyStatus = itemStatus.IsReadonly;
					} else {
						readOnlyStatus = false;
					}
					service.setRowReadonlyFromLayout(item, readOnlyStatus);
					return readOnlyStatus;
				};

				self.getItemStatus = function getItemStatus(item) { // jshint ignore:line
					var conStatuses = basicsLookupdataLookupDescriptorService.getData('ConStatus');
					return _.find(conStatuses, {Id: item.ConStatusFk});
				};
				service.getCellEditable = function (item, model) {
					itemStatus = self.getItemStatus(item);// jshint ignore:line
					if(itemStatus && itemStatus.IsReadonly){
						return false;
					}
					return service.getIsEditalbeByField(item, model);
				};

				service.getIsEditalbeByField = function (item, model) {
					var editable = true;
					if (model === 'BusinessPartnerFk') {
						editable = !item.MaterialCatalogFk && !item.ConHeaderFk && !item.BoqWicCatFk;
					}
					else if (model === 'ContactFk') {
						editable = !item.ConHeaderFk || (item.ConHeaderFk && !item.ProjectChangeFk);
					}
					else if (model === 'SubsidiaryFk') {
						editable = !item.MaterialCatalogFk && !!item.BusinessPartnerFk && !item.ConHeaderFk && !item.BoqWicCatFk;
					} else if (model === 'SupplierFk') {
						editable = !item.MaterialCatalogFk && !item.ConHeaderFk && !item.BoqWicCatFk;
					} else if (model === 'BusinessPartner2Fk' || model === 'Contact2Fk') {
						editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
					}
					else if (model === 'Subsidiary2Fk') {
						editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
					} else if (model === 'PaymentTermPaFk') {
						// editable when ConHeaderFk is null
						editable = !item.ConHeaderFk;
					} else if (model === 'PaymentTermFiFk') {
						// editable when ConHeaderFk is null
						editable = !item.ConHeaderFk;
					} else if (model === 'PaymentTermAdFk') {
						// editable when ConHeaderFk is null
						editable = !item.ConHeaderFk;
					} else if (model === 'IncotermFk') {
						// editable when ConHeaderFk is null
						editable = !item.ConHeaderFk;
					}
					else if (model === 'Supplier2Fk') {
						editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
					} else if (model === 'LeadTimeExtra') {
						editable = false;
					}
					else if (model === 'ExchangeRate') {
						// editable = item.companyCurrencyId !== item.BasCurrencyFk;
						// keep same as header-data-service getCellEditable function
						editable = moduleContext.companyCurrencyId !== item.BasCurrencyFk;
					}
					else if (model === 'PackageFk' || model === 'ProjectFk'||model === 'ContracttypeFk') {

						editable = !item.ConHeaderFk;
					}
					else if (model === 'PrcHeaderEntity.ConfigurationFk') {
						// editable only before first time save
						editable = item.Version === 0;
					}
					else if (model === 'TaxCodeFk') {
						editable = !item.MaterialCatalogFk && !item.BoqWicCatFk;
					}
					else if (model === 'Code') {
						editable = item.CanChangeCode&&item.Version===0;
					}
					else if (model === 'CompanyInvoiceFk') {
						editable = !item.ConHeaderFk;
					}
					else if (model === 'ContractHeaderFk') {
						editable = !item.HasItems && !item.MaterialCatalogFk && !item.BoqWicCatFk && !item.IsFramework;
					}
					else if (model === 'ProjectChangeFk') {
						editable = !item.HasItems && !item.IsFramework;
					}
					else if(model==='CodeQuotation'){
						return false;
					}
					else if(model === 'BasCurrencyFk' || model === 'PrcCopyModeFk'){
						editable = !contractHeaderPurchaseOrdersDataService.isCallOff(item);
					}
					else if (model === 'MaterialCatalogFk') {
						prcConfigurations = !prcConfigurations ? basicsLookupdataLookupDescriptorService.getData('prcconfiguration') : prcConfigurations;
						if (item.IsFramework) {
							editable = false;
						}
						else if (_.has(item, 'PrcHeaderEntity.ConfigurationFk') && prcConfigurations && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk] && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk].IsMaterial) {
							editable = !item.ContractHeaderFk && !contractHeaderPurchaseOrdersDataService.isCallOff(item);
						}
						else {
							editable = false;
						}
					}
					else if (model === 'BankFk') {
						editable = !!item.BusinessPartnerFk;
					}
					else if (model === 'BoqWicCatFk') {
						prcConfigurations = !prcConfigurations ? basicsLookupdataLookupDescriptorService.getData('prcconfiguration') : prcConfigurations;
						if (item.IsFramework) {
							editable = false;
						}
						else if (_.has(item, 'PrcHeaderEntity.ConfigurationFk') && prcConfigurations && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk] && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk].IsService) {
							editable = !item.ContractHeaderFk;
						}
						else {
							editable = false;
						}
					}
					else if (model === 'BoqWicCatBoqFk') {
						if (item.IsFramework) {
							editable = false;
						}
						editable = !!item.BoqWicCatFk && !item.ContractHeaderFk;
					}

					return editable;
				};

				return service;
			}]);
})(angular);