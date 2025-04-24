/**
 * Created by wed on 5/18/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.billingschema';
	var cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('basicsBillingSchemaLayoutFactory', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {


		function getLayout(formId, customLayout) {

			var baseBillingSchemaLayout = {
				'fid': formId,
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'accountno', 'sorting', 'description', 'description2', 'billinglinetypefk',
							'finaltotal', 'generalstypefk', 'isbold', 'iseditable', 'isitalic',
							'group1', 'group2', 'controllingunitfk', 'isprinted','isresetfi','isnetadjusted',
							'isturnover', 'isunderline', 'offsetaccountno', 'taxcodefk', 'value', 'result', 'resultoc',
							'credfactor', 'debfactor', 'detailauthoramountfk', 'billingschemadetailtaxfk', 'credlinetypefk', 'deblinetypefk', 'formula',
							'coderetention', 'paymenttermfk', 'costlinetypefk']
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
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						'userDefText': {
							'location': cloudCommonModule,
							'identifier': 'UserdefTexts',
							'initial': 'User Define'
						},
						'AccountNo': {
							'location': moduleName,
							'identifier': 'entityAccountNo',
							'initial': 'Account No.'
						},
						'Sorting': {'location': cloudCommonModule, 'identifier': 'entitySorting', 'initial': 'Sort By'},
						'BillingLineTypeFk': {
							'location': moduleName,
							'identifier': 'entityBillingLineTypeFk',
							'initial': 'Type'
						},
						'BillingSchemaFk': {
							'location': moduleName,
							'identifier': 'entityBillingSchemaDetailFk',
							'initial': 'Billing Schema'
						},
						'GeneralsTypeFk': {
							'location': moduleName,
							'identifier': 'entityGeneralsTypeFk',
							'initial': 'General Type'
						},
						'Value': {'location': moduleName, 'identifier': 'entityValue', 'initial': 'Value'},
						'Result': {'location': moduleName, 'identifier': 'entityResult', 'initial': 'Result'},
						'ResultOc': {'location': moduleName, 'identifier': 'entityResultOc', 'initial': 'Result OC'},
						'IsEditable': {'location': moduleName, 'identifier': 'entityIsEditable', 'initial': 'Edit'},
						'Group1': {'location': moduleName, 'identifier': 'entityGroup1', 'initial': 'Group 1'},
						'Group2': {'location': moduleName, 'identifier': 'entityGroup2', 'initial': 'Group 2'},
						'Description': {
							'location': cloudCommonModule,
							'identifier': 'entityDescription',
							'initial': 'Description'
						},
						'Description2': {
							'location': moduleName,
							'identifier': 'entityDescription2',
							'initial': 'Description 2'
						},
						'IsPrinted': {'location': moduleName, 'identifier': 'entityIsPrinted', 'initial': 'Print'},
						'OffsetAccountNo': {
							'location': moduleName,
							'identifier': 'entityOffsetAccountNo',
							'initial': 'Offset Account'
						},
						'IsTurnover': {'location': moduleName, 'identifier': 'entityIsTurnover', 'initial': 'Turnover'},
						'IsResetFI': {'location': moduleName, 'identifier': 'entityIsResetFI', 'initial': 'Reset FI'},
						'IsNetAdjusted': {'location': moduleName, 'identifier': 'entityIsNetAdjusted', 'initial': 'Net Adjusted'},
						'TaxCodeFk': {
							'location': cloudCommonModule,
							'identifier': 'entityTaxCode',
							'initial': 'Tax Code'
						},
						'FinalTotal': {'location': moduleName, 'identifier': 'entityFinalTotal', 'initial': 'Final'},
						'HasControllingUnit': {
							'location': moduleName,
							'identifier': 'entityHasControllingUnit',
							'initial': 'Has Controlling Unit'
						},
						'ControllingUnitFk': {
							'location': cloudCommonModule,
							'identifier': 'entityControllingUnitCode',
							'initial': 'Controlling Unit Code'
						},
						'IsBold': {'location': moduleName, 'identifier': 'entityIsBold', 'initial': 'Bold'},
						'IsItalic': {'location': moduleName, 'identifier': 'entityIsItalic', 'initial': 'Italic'},
						'IsUnderline': {
							'location': moduleName,
							'identifier': 'entityIsUnderline',
							'initial': 'Underline'
						},
						'UserDefined1': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '1'}
						},
						'UserDefined2': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '2'}
						},
						'UserDefined3': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '3'}
						},
						CredFactor: {
							location: moduleName,
							identifier: 'credFactor',
							initial: 'Cred Factor'
						},
						DebFactor: {
							location: moduleName,
							identifier: 'debFactor',
							initial: 'Deb Factor'
						},
						DetailAuthorAmountFk: {
							location: moduleName,
							identifier: 'billingschmdtlaafk',
							initial: 'Author.Amount Ref'
						},
						BillingSchemaDetailTaxFk: {
							location: moduleName,
							identifier: 'billingSchmDtlTaxFk',
							initial: 'Tax Ref'
						},
						CredLineTypeFk: {
							location: moduleName,
							identifier: 'creditorlinetype',
							initial: 'Treatment Cred'
						},
						DebLineTypeFk: {
							location: moduleName,
							identifier: 'debitorlinetype',
							initial: 'Treatment Deb'
						},
						Formula: {
							location: cloudCommonModule,
							identifier: 'formula',
							initial: 'Formula'
						},
						CodeRetention: {
							location: moduleName,
							identifier: 'codeRetention', initial: 'Code Retention'},
						PaymentTermFk: {location: moduleName, identifier: 'paymentTerm', initial: 'Payment Term'},
						CostLineTypeFk: {location: moduleName, identifier: 'costLineTypeFk', initial: 'Cost Line Type'}
					}
				},
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
					'accountno': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'sorting': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'description': {
						grid: {
							sortable: false
						}
					},
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
						'detail': {
							'directive': 'basics-billing-schema-billing-line-type-combobox'
						}
					},
					'finaltotal': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {'readonly': true}
					},
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
					'isbold': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {'readonly': true}
					},
					'iseditable': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {'readonly': true}
					},
					'isitalic': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'group1': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'group2': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'controllingunitfk': {
						grid: {
							editor: 'lookup',
							sortable: false,
							editorOptions: {
								lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
								lookupOptions: {
									filterKey: ''
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ControllingUnit',
								'displayMember': 'Code'
							}
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
					'isprinted': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'isturnover': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'isresetfi': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'isnetadjusted': {
						grid: {
							sortable: false,
							editor: null,
							width: 100
						},
						detail: {
							'readonly': true
						}
					},
					'isunderline': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
					'offsetaccountno': {
						grid: {
							sortable: false,
							editor: null
						},
						detail: {
							'readonly': true
						}
					},
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
						readonly: true,
						grid: {
							sortable: false,
							formatterOptions: {
								decimalPlaces: 2
							}
						}

					},
					'resultoc': {
						readonly: true,
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
								lookupType: 'BillingSchemaLookup',
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
								lookupType: 'BillingSchemaLookup',
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
					'deblinetypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.debitorlinetype'),
					'userdefined1': {
						readonly: true,
						grid: {
							sortable: false
						}
					},
					'userdefined2': {
						readonly: true,
						grid: {
							sortable: false
						}
					},
					'userdefined3': {
						readonly: true,
						grid: {
							sortable: false
						}
					},
					'formula': {
						maxLength: 255
					},
					'coderetention': {
						maxLength: 16
					},
					'costlinetypefk':  basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.costlinetype'),
					'paymenttermfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm')
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
			return angular.extend(baseBillingSchemaLayout, customLayout);

		}

		return {
			getLayout: getLayout
		};

	}]);

})(angular);
