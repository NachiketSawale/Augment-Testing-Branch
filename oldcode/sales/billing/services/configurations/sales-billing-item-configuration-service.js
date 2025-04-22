/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingItemConfigurationService', ['$injector', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'basicsLookupdataConfigGenerator', 'salesCommonLookupConfigsService', 'salesBillingTranslationService', 'platformSchemaService','procurementCommonPriceConditionService',
		function ($injector, platformUIStandardConfigService, platformUIStandardExtentService, basicsLookupdataConfigGenerator, salesCommonLookupConfigsService, salesBillingTranslationService, platformSchemaService, priceConditionDataService) {

			var billingItemDetailLayout = {
				'fid': 'sales.billing.item.detailform',
				'version': '0.1.1',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'itemno', 'description1', 'description2', 'specification',
							'costcodefk', 'mdcmaterialfk', 'prcpriceconditionfk', 'priceextra', 'priceextraoc',
							'totalprice', 'totalpriceoc', 'pricegross', 'pricegrossoc', 'totalpricegross', 'totalpricegrossoc', 'total', 'totaloc', 'totalgross', 'totalgrossoc',
							'quantity', 'uomfk', 'price', 'priceoc', 'amountnet', 'amountvat', 'amountnetoc', 'amountgross', 'amountgrossoc',
							'controllingunitfk', 'prcstructurefk', 'taxcodefk','mdcsalestaxgroupfk','icinvheadercode'
						]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {
					icinvheadercode: {
						readonly: true
					},
					amountnet: {
						readonly: true,
						isTransient: true
					},
					amountnetoc: {
						readonly: true,
						isTransient: true
					},
					amountvat: {
						readonly: true,
						isTransient: true
					},
					amountgross: { // TODO: put gross in billing schema?
						readonly: true,
						isTransient: true
					},
					amountgrossoc: {
						readonly: true,
						isTransient: true
					},
					totalprice: {
						readonly: true,
						isTransient: true
					},
					totalpriceoc: {
						readonly: true,
						isTransient: true
					},
					priceextra: {
						readonly: true
					},
					priceextraoc: {
						readonly: true
					},
					// pricegross: { readonly: true, isTransient: true },
					// pricegrossoc: { readonly: true, isTransient: true },
					totalpricegross: { readonly: true, isTransient: true },
					totalpricegrossoc: { readonly: true, isTransient: true },
					total: { readonly: true, isTransient: true },
					totaloc: { readonly: true, isTransient: true },
					totalgross: { readonly: true, isTransient: true },
					totalgrossoc: { readonly: true, isTransient: true },
					costcodefk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CostCode',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupField: 'CostCodeFk',
								lookupOptions: {showClearButton: true},
								directive: 'sales-Billing-Item-Cost-Codes-Lookup'
							}
						},
						detail: {
							type: 'directive',
							directive: 'sales-Billing-Item-Cost-Codes-Lookup',
							options: {
								showClearButton: true,
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					mdcmaterialfk: {
						navigator: {moduleName: 'basics.material'},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-material-material-lookup'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {showClearButton: true},
								lookupDirective: 'basics-material-material-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}),
					controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'controllingStructureUnitLookupDataService',
						filter: function (billItemEntity) {
							// get project id from parent bill header
							var salesBillingService = $injector.get('salesBillingService');
							var bilHeaderEntity = salesBillingService.getItemById(billItemEntity.BilHeaderFk);
							return bilHeaderEntity ? bilHeaderEntity.ProjectFk : null;
						},
						readonly: false
					}),
					prcpriceconditionfk: {
						detail: {
							type: 'directive',
							directive: 'item-basics-Material-Price-Condition-Combobox',
							options: {
								filterKey: 'req-requisition-filter',
								showClearButton: true,
								dataService: priceConditionDataService.getService
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcPricecondition',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'item-basics-Material-Price-Condition-Combobox',
								lookupOptions: {
									filterKey: 'req-requisition-filter',
									showClearButton: true,
									dataService: priceConditionDataService.getService
								}
							},
							width: 180
						}
					}
					// prcstructurefk (see addCommonLookupsToLayout() below)
				}
			};

			salesCommonLookupConfigsService.addCommonLookupsToLayout(billingItemDetailLayout);

			var BaseService = platformUIStandardConfigService;

			var salesBillingItemDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ItemDto',
				moduleSubModule: 'Sales.Billing'
			});

			if (salesBillingItemDomainSchema) {
				salesBillingItemDomainSchema = salesBillingItemDomainSchema.properties;
			}

			// extend scheme for additional attributes
			salesBillingItemDomainSchema.AmountNet = {domain: 'money'};
			salesBillingItemDomainSchema.AmountNetOc = {domain: 'money'};
			salesBillingItemDomainSchema.AmountVat = {domain: 'money'};
			salesBillingItemDomainSchema.AmountGross = {domain: 'money'}; // TODO: put gross in billing schema?
			salesBillingItemDomainSchema.AmountGrossOc = {domain: 'money'};

			function SalesBillingUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesBillingUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBillingUIStandardService.prototype.constructor = SalesBillingUIStandardService;
			var service = new BaseService(billingItemDetailLayout, salesBillingItemDomainSchema, salesBillingTranslationService);

			platformUIStandardExtentService.extend(service, salesCommonLookupConfigsService.getAdditionalGridColumnsFor(['prcstructurefk']));

			return service;
		}
	]);
})();
