/**
 * Created by wwa on 7/11/2016.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */
	angular.module('procurement.requisition').factory('procurementRequisitionHeaderReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', 'basicsLookupdataLookupDescriptorService',
			'procurementRequisitionNumberGenerationSettingsService',
			function (commonReadOnlyProcessor, moduleContext, basicsLookupdataLookupDescriptorService,
					  procurementRequisitionNumberGenerationSettingsService) {


				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					uiStandardService: 'procurementRequisitionHeaderUIStandardService',
					readOnlyFields: ['Code','ExchangeRate', 'BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk', 'IncotermFk', 'BasPaymentTermFiFk', 'BasPaymentTermPaFk', 'BasPaymentTermAdFk', 'Subsidiary2Fk', 'BusinessPartner2Fk', 'Supplier2Fk', 'ProjectFk', 'PackageFk', 'PrcHeaderEntity.ConfigurationFk', 'TaxCodeFk', 'BoqWicCatFk', 'BoqWicCatBoqFk']
				});


				var itemStatus, readOnlyStatus, prcConfigurations;
				var self = this;

				service.handlerItemReadOnlyStatus = function (item) {
					itemStatus = self.getItemStatus(item);
					if (itemStatus) {
						readOnlyStatus = itemStatus.Isreadonly;
					} else {
						readOnlyStatus = false;
					}
					service.setRowReadonlyFromLayout(item, readOnlyStatus);
					return readOnlyStatus;
				};

				self.getItemStatus = function getItemStatus(item) {
					var reqStatuses = basicsLookupdataLookupDescriptorService.getData('ReqStatus');
					return _.find(reqStatuses, {Id: item.ReqStatusFk});
				};

				service.getCellEditable = function (item, model) {
					var editable = true;
					var arr = ['IncotermFk', 'BasPaymentTermFiFk', 'BasPaymentTermPaFk', 'BasPaymentTermAdFk', 'Subsidiary2Fk', 'BusinessPartner2Fk', 'Supplier2Fk', 'TaxCodeFk'];
					var find = _.indexOf(arr, model);
					if (model === 'ExchangeRate') {
						editable = moduleContext.companyCurrencyId !== item.BasCurrencyFk;
					}
					else if (find > -1) {
						editable = item.MaterialCatalogFk === null && !item.BoqWicCatFk;
					}
					else if (model === 'PackageFk' || model === 'ProjectFk') {

						editable = !item.ReqHeaderFk;
					}
					else if (model === 'PrcHeaderEntity.ConfigurationFk') {
						// editable only before first time save
						editable = item.Version === 0;
					}
					else if (model === 'BusinessPartnerFk' || model === 'SupplierFk') {
						editable = !item.MaterialCatalogFk && !item.ReqHeaderFk && !item.BoqWicCatFk;
					}
					else if (model === 'SubsidiaryFk') {
						editable = !item.MaterialCatalogFk && !!item.BusinessPartnerFk && !item.ReqHeaderFk && !item.BoqWicCatFk;
					}
					else if(model==='Code'){
						editable=item.Version===0;
						if (item.Version === 0 && item.PrcHeaderEntity.ConfigurationFk) {
							prcConfigurations = !prcConfigurations ? basicsLookupdataLookupDescriptorService.getData('prcconfiguration') : prcConfigurations;
							if (prcConfigurations && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk]) {
								let config = prcConfigurations[item.PrcHeaderEntity.ConfigurationFk];
								editable = !procurementRequisitionNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
							}
						}
					}
					else if (model === 'BoqWicCatFk') {
						prcConfigurations = !prcConfigurations ? basicsLookupdataLookupDescriptorService.getData('prcconfiguration') : prcConfigurations;
						editable = !!(_.has(item, 'PrcHeaderEntity.ConfigurationFk') && prcConfigurations && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk] && prcConfigurations[item.PrcHeaderEntity.ConfigurationFk].IsService);
					}
					else if (model === 'BoqWicCatBoqFk') {
						editable = !!item.BoqWicCatFk;
					}
					return editable;
				};

				return service;
			}]);
})(angular);