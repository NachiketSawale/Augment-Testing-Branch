/**
 * Created by xai on 4/11/2018.
 */

(function(angular){
	'use strict';
	var modName = 'basics.materialcatalog',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('basicsMaterialCatalogPriceVersionToCustomerLayout', basicsMaterialCatalogPriceVersionToCustomerLayout);
	basicsMaterialCatalogPriceVersionToCustomerLayout.$inject = ['basicsLookupdataConfigGeneratorExtension'];

	function basicsMaterialCatalogPriceVersionToCustomerLayout(basicsLookupdataConfigGeneratorExtension) {
		return {
			'fid': 'basics.materialCatalog.priceVesion.to.customer.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['bpdbusinesspartnerfk','bpdsubsidiaryfk','bpdcustomerfk','baspaymenttermfk','mdcbillingschemafk','termsconditions']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [modName,cloudCommonModule],
				'extraWords': {
					BpdBusinesspartnerFk: {
						location: cloudCommonModule,
						identifier: 'entityBusinessPartner',
						initial: 'Business Partner'
					},
					BpdCustomerFk: {
						location: cloudCommonModule,
						identifier: 'entityCustomer',
						initial: 'Customer'
					},
					BpdSubsidiaryFk: {
						location: cloudCommonModule,
						identifier: 'entitySubsidiary',
						initial: 'Subsidiary'
					},
					BasPaymentTermFk: {
						location: cloudCommonModule,
						identifier: 'entityPaymentTermPA',
						initial: 'Payment Term (PA)'
					},
					MdcBillingSchemaFk: {
						location: cloudCommonModule,
						identifier: 'entityBillingSchema',
						initial: 'Billing Schema'
					},
					TermsConditions: {
						location: modName,
						identifier: 'basics.materialcatalog.termsAndConditions',
						initial: 'Terms And Conditions'
					}
				}
			},
			'overloads': {
				'bpdbusinesspartnerfk': {
					mandatory: true,
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						'editor': 'lookup',
						'editorOptions': {
							directive: 'business-partner-main-business-partner-dialog',
							lookupOptions: {}
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-business-partner-dialog',
						'options': {
							'displayMember': 'BusinessPartnerName1'
						}
					}
				},
				'bpdcustomerfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-material-catalog-price-version-customer-lookup',
							lookupOptions: {
								filterKey: 'mdc-material-catalog-customer-filter',
								displayMember: 'BusinessPartnerName1',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'customer', 'displayMember': 'BusinessPartnerName1'},
						width: 125
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-material-catalog-price-version-customer-lookup',
							// descriptionField: 'BusinessPartnerName1',
							descriptionMember: 'BusinessPartnerName1',
							lookupOptions: {
								filterKey: 'mdc-material-catalog-customer-filter',
								showClearButton: true
							}
						}
					}
				},
				'bpdsubsidiaryfk': {
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						},
						'editor': 'lookup',
						'editorOptions': {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								filterKey: 'mdc-material-catalog-customer-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							}
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-subsidiary-lookup',
						'options': {
							filterKey: 'mdc-material-catalog-customer-subsidiary-filter',
							showClearButton: true,
							displayMember: 'AddressLine'
						},
						'model': 'SubsidiaryFk'
					}
				},
				'baspaymenttermfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.lookup.paymentterm', null, {showClearButton: true}),
				'mdcbillingschemafk': {
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-billing-schema-billing-schema-combobox',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BillingSchema',
							displayMember: 'Description'
						},
						width: 125
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-billing-schema-billing-schema-combobox',
						'model': 'BillingSchemaFk',
						'options': {
							descriptionMember: 'Description',
							showClearButton: true
						}
					}
				}
			}
		};
	}
})(angular);