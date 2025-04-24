/**
 * Created by jie on 15/03/2023.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	angular.module(moduleName).factory('basicsCompanyICPartnerUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService, platformUIStandardExtentService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.companyICPartner',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['id', 'bascompanypartnerfk', 'bpdcustomerfk', 'bpdsupplierfk', 'accountrevenue', 'accountcost', 'mdccontrollinguniticfk','prcconfigurationbilfk',
									'mdcbillschemabilfk','prcconfigurationinvfk','mdcbillschemainvfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							id: {
								readonly: true
							},
							bascompanypartnerfk: {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-company-company-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'company',
										displayMember: 'Code'
									},
									width: 120
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'model': 'BasCompanyPartnerFk',
									'options': {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName',
										lookupOptions: {}
									}
								}
							},
							'bpdcustomerfk': {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'basics-company-customerledger-group',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
									width: 125,
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'business-partner-main-customer-lookup',
										descriptionField: 'Description',
										descriptionMember: 'Description',
										filterKey: 'basics-company-customerledger-group',
										lookupOptions: {
											showClearButton: true
										}
									},
								},
							},
							bpdsupplierfk: {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'lookupOptions': {
											'filterKey': 'basics-company-supplier-filter',
											'showClearButton': true
										}, 'directive': 'business-partner-main-supplier-lookup'
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'supplier', 'displayMember': 'Code'},
									'width': 120
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'business-partner-main-supplier-lookup',
										'descriptionMember': 'Description',
										'filterKey': 'basics-company-supplier-filter',
										'lookupOptions': {
											'showClearButton': true
										}
									}
								}
							},
							'mdccontrollinguniticfk': {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'controlling-structure-dialog-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										filterKey: 'basics-company-controlling-by-prj-filter',
										lookupOptions: {
											showClearButton: false
										}
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											filterKey: 'basics-company-controlling-by-prj-filter',
											showClearButton: false
										},
										directive: 'controlling-structure-dialog-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Controllingunit',
										displayMember: 'Code'
									},
									width: 130
								}
							},
							'prcconfigurationbilfk': {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-configuration-configuration-combobox',
										lookupOptions: {
											filterKey: 'configuration-bil-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prcConfiguration',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 120
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-configuration-configuration-combobox',
									'options': {
										descriptionMember: 'DescriptionInfo.Translated',
										filterKey: 'configuration-bil-filter'
									}
								}
							},
							'mdcbillschemabilfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-configuration-billing-schema-combobox',
										'lookupOptions': {
											'filterKey': 'billingSchema-bil-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'PrcConfig2BSchema',
										'displayMember': 'DescriptionInfo.Translated'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'procurement-configuration-billing-schema-Combobox',
									'options': {
										filterKey: 'billingSchema-bil-filter'
									}
								}
							},
							'prcconfigurationinvfk': {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-configuration-configuration-combobox',
										lookupOptions: {
											filterKey: 'configuration-inv-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prcConfiguration',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 120
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-configuration-configuration-combobox',
									'options': {
										descriptionMember: 'DescriptionInfo.Translated',
										filterKey: 'configuration-inv-filter',
									}
								}
							},
							'mdcbillschemainvfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-configuration-billing-schema-combobox',
										'lookupOptions': {
											'filterKey': 'billingSchema-inv-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'PrcConfig2BSchema',
										'displayMember': 'DescriptionInfo.Translated'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'procurement-configuration-billing-schema-Combobox',
									'options': {
										filterKey: 'billingSchema-inv-filter'
									}
								}
							},
						},
						'addition': {
							'grid': [
								{
									'afterId': 'bascompanypartnerfk',
									id: 'CompanyName',
									field: 'BasCompanyPartnerFk',
									name: 'Company IC Partner Name',
									name$tr$: 'basics.company.entityCompanyICPartnerName',
									sortable: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'company',
										displayMember: 'CompanyName'
									},
									width: 150
								},{
									'afterId': 'bpdcustomerfk',
									id: 'BpdCustomer',
									field: 'BpdCustomerFk',
									name: 'Customer Description',
									name$tr$: 'basics.company.entityCustomerDesc',
									sortable: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'customer',
										displayMember: 'Description'
									}
								},{
									'afterId': 'bpdsupplierfk',
									id: 'BpdSupplier',
									field: 'BpdSupplierFk',
									name: 'Supplier Description',
									name$tr$: 'basics.company.entitySupplierDesc',
									sortable: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'supplier',
										displayMember: 'Description'
									}
								},{
									'afterId': 'mdccontrollinguniticfk',
									id: 'MdcControllingunitIc',
									field: 'MdcControllingunitIcFk',
									name: 'Controlling User Description',
									name$tr$: 'basics.company.entityClearingControllingUnitDesc',
									sortable: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Controllingunit',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 150
								}]
						}
					};
				}

				var companyICPartnerDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyICPartnerAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyICPartnerDto',
					moduleSubModule: 'Basics.Company'
				});

				companyICPartnerAttributeDomains = companyICPartnerAttributeDomains.properties;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'CompanyICPartnerDto', moduleSubModule: 'Basics.Company'}).properties;
				var service = new BaseService(companyICPartnerDetailLayout, companyICPartnerAttributeDomains, basicsCompanyTranslationService);
				platformUIStandardExtentService.extend(service, companyICPartnerDetailLayout.addition, domains);
				return service;
			}
		]);
})(angular);