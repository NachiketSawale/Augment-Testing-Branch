/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractBillingSchemaConfigurationService',
		['$injector', 'platformUIStandardConfigService', 'salesContractTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
			function ($injector, platformUIStandardConfigService, salesContractTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				var schemasForProjectDetailLayout = {
					'fid': 'sales.contract.schemas.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['accountno', 'sorting', 'description', 'description2', 'billinglinetypefk',
								'finaltotal', 'generalstypefk', 'isbold', 'iseditable', 'isitalic',
								'group1', 'group2', 'controllingunitfk', 'isprinted','isnetadjusted',
								'isturnover', 'isunderline', 'offsetaccountno', 'taxcodefk', 'value', 'result', 'resultoc',
								'credfactor', 'debfactor', 'detailauthoramountfk', 'billingschemadetailtaxfk', 'credlinetypefk', 'deblinetypefk', 'formula',
								'coderetention', 'baspaymenttermfk', 'costlinetypefk']
						},
						{
							'gid': 'userDefText',
							'isUserDefText': true,
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'value': {
							grid: {
								formatter: 'dynamic',
								formatterOptions: {
									decimalPlaces: 2
								},
								domain: function (item) {
									var domain;
									switch (item.BillingLineTypeFk) {
										case 11:
											domain = 'quantity';
											break;

										default :
											domain = 'money';
											break;
									}
									return domain;
								}
							}
						},
						'accountno': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'sorting': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'description': {grid: {sortable: false}},
						'billinglinetypefk': {
							'readonly': true,
							'grid': {
								editor: null,
								sortable: false,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BillingLineType',
									displayMember: 'Description'
								}
							},
							'detail': {'directive': 'basics-billing-schema-billing-line-type-combobox'}
						},
						'finaltotal': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'generalstypefk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurementstructure-prc-generals-type-combobox',
								'readonly': true,
								'options': {
									descriptionMember: 'DescriptionInfo.Translated',
									filterKey: 'procurement-common-generals-type-lookup'
								}
							},
							'grid': {
								editor: null,
								sortable: false,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcGeneralsType',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 100
							}
						},
						'isbold': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'iseditable': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'isitalic': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'isnetadjusted': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'group1': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'group2': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'controllingunitfk': {
							grid: {
								editor: 'lookup',
								sortable: false,
								editorOptions: {
									lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
									lookupOptions: {
										filterKey: 'sales-contract-generals-controlling-unit-filter'
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'ControllingUnit', 'displayMember': 'Code'}
							},
							detail: {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-master-data-context-controlling-unit-lookup',
									'descriptionMember': 'DescriptionInfo.Translated',
									'lookupOptions': {
										'showClearButton': true
									}
								}
							}
						},
						'isprinted': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'isturnover': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'isunderline': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'offsetaccountno': {grid: {sortable: false, editor: null}, detail: {'readonly': true}},
						'taxcodefk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'readonly': true,
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-master-data-context-tax-code-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								sortable: false,
								formatterOptions: {
									lookupType: 'TaxCode',
									displayMember: 'Code'
								},
								editor: null,
								width: 100
							}
						},
						'result': {
							grid: {
								sortable: false,
								formatterOptions: {
									decimalPlaces: 2
								}
							}
						},
						'resultoc': {
							grid: {
								sortable: false,
								formatterOptions: {
									decimalPlaces: 2
								}
							}
						},

						'detailauthoramountfk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'options': {
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ConBillingSchemas',
									displayMember: 'Description'
								}
							}
						},
						'billingschemadetailtaxfk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'options': {
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ConBillingSchemas',
									displayMember: 'Description'
								}
							}
						},
						'credfactor': {
							readonly: true
						},
						'debfactor': {
							readonly: true
						},
						'credlinetypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.creditorlinetype'),
						'deblinetypefk':  basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.debitorlinetype'),
						'userdefined1': {readonly: true, grid: {sortable: false}},
						'userdefined2': {readonly: true, grid: {sortable: false}},
						'userdefined3': {readonly: true, grid: {sortable: false}},
						'formula': {
							maxLength: 255
						},
						'coderetention': {
							maxLength: 16
						},
						'baspaymenttermfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm'),
						'costlinetypefk':  basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.costlinetype')
					},
					'addition': {
						'grid': [
							{
								'lookupDisplayColumn': true,
								'field': 'ControllingUnitFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'cloud.common.entityControllingUnitDesc',
								'width': 100
							}, {
								'lookupDisplayColumn': true,
								'field': 'TaxCodeFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'cloud.common.entityTaxCodeDescription',
								'width': 150
							}
						]
					}
				};

				var BaseService = platformUIStandardConfigService;

				var salesBillingSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'OrdBillingschemaDto',
					moduleSubModule: 'Sales.Contract'
				});

				if (salesBillingSchema) {
					salesBillingSchema = salesBillingSchema.properties;
				}

				function SalesBillingUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				SalesBillingUIStandardService.prototype = Object.create(BaseService.prototype);
				SalesBillingUIStandardService.prototype.constructor = SalesBillingUIStandardService;
				return new BaseService(schemasForProjectDetailLayout, salesBillingSchema, salesContractTranslationService);
			}
		]);
})();
