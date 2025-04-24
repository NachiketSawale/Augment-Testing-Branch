/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	'use strict';

	var modName = 'basics.billingschema',
		cloudCommonModule = 'cloud.common',
		basicsCustomizeModule = 'basics.customize';
	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaConfigurationValuesService
	 * @function
	 *
	 * @description
	 * basicsBillingSchemaConfigurationValuesService is the config service for all billing schema's views.
	 */
	angular.module(modName).factory('basicsBillingSchemaConfigurationValuesService',
		[ 'basicsLookupdataConfigGenerator',
			function (basicsLookupdataConfigGenerator) {
				var service = {};

				var basicsBillingSchemaLayout = {
					'fid': 'basics.billingSchema.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': [
								'sorting', 'descriptioninfo', 'validfrom',
								'validto', 'isdefault', 'ischained', 'ischainedpes', 'autocorrectnetlimit',
								'autocorrectvatlimit', 'invstatusokfk', 'invstatuserrorfk', 'bilstatusokfk', 'bilstatuserrorfk'
							]
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
						'extraModules': [modName],
						'extraWords': {
							userDefText: {
								location: cloudCommonModule,
								identifier: 'UserdefTexts',
								initial: 'User Defined Text'
							},
							Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
							ValidFrom: {
								location: cloudCommonModule,
								identifier: 'entityValidFrom',
								initial: 'Valid From'
							},
							ValidTo: {location: cloudCommonModule, identifier: 'entityValidTo', initial: 'Valid To'},
							IsDefault: {location: modName, identifier: 'entityIsDefault', initial: 'Default'},
							IsChained: {location: modName, identifier: 'entityIsChained', initial: 'Chained'},
							IsChainedPes: {location: modName, identifier: 'entityIsChainedPes', initial: 'Chained Pes'},
							AutoCorrectNetLimit: {
								location: modName,
								identifier: 'autoCorrectNetLimit',
								initial: 'Auto Correct Net Limit '
							},
							AutoCorrectVatLimit: {
								location: modName,
								identifier: 'autoCorrectVatLimit',
								initial: 'Auto Correct VAT Limit'
							},
							InvStatusOkFk: {location: modName, identifier: 'invOkStatusFk', initial: 'OK Status(Invoice)'},
							InvStatusErrorFk: {
								location: modName,
								identifier: 'invErrorStatusFk',
								initial: 'Error status(Invoice)'
							},
							BilStatusOkFk: {
								location: modName,
								identifier: 'bilOkStatusFk',
								initial: 'OK Status(Billing)'
							},
							BilStatusErrorFk: {
								location: modName,
								identifier: 'bilErrorStatusFk',
								initial: 'Error Status(Billing)'
							},
							UserDefined1: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined1',
								initial: 'User Defined 1'
							},
							UserDefined2: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined2',
								initial: 'User Defined 2'
							},
							UserDefined3: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined3',
								initial: 'User Defined 3'
							}
						}
					},
					'overloads': {
						'invstatusokfk': {
							'detail': {
								'type': 'directive',
								'directive': 'procurement-invoice-status-lookup',
								'options': {
									lookupDirective: 'procurement-invoice-status-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService',
									lookupOptions: {
										showClearButton: false
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true
									},
									directive: 'procurement-invoice-status-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'InvStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								}
							}
						},
						'invstatuserrorfk': {
							'detail': {
								'type': 'directive',
								'directive': 'procurement-invoice-status-lookup',
								'options': {
									lookupDirective: 'procurement-invoice-status-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService',
									lookupOptions: {
										showClearButton: false
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true
									},
									directive: 'procurement-invoice-status-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'InvStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								}
							}
						},
						'bilstatusokfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.billstatus', null, {
							showIcon: true
						}),
						'bilstatuserrorfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.billstatus', null, {
							showIcon: true
						})
					}
				};

				var basicsBillingSchemaDetailLayout = {
					'fid': 'basics.billingSchema.billingschemadetailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': [
								'accountno', 'sorting', 'billingschemadetailfk',
								'descriptioninfo', 'description2info', 'billinglinetypefk',
								'finaltotal', 'generalstypefk', 'isbold',
								'iseditable', 'isitalic', 'ishidden', 'ishiddenifzero', 'group1',
								'group2', 'hascontrollingunit', 'isprinted','isresetfi','isnetadjusted',
								'isturnover', 'isunderline', 'offsetaccountno',
								'taxcodefk', 'value', 'credfactor', 'debfactor', 'detailauthoramountfk',
								'billingschemadetailtaxfk', 'credlinetypefk', 'deblinetypefk', 'formula',
								'coderetention', 'paymenttermfk', 'costlinetypefk', 'sqlstatement', 'factor'
							]
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
						'extraModules': [modName, basicsCustomizeModule],
						'extraWords': {
							userDefText: {
								location: cloudCommonModule,
								identifier: 'UserdefTexts',
								initial: 'User Defined Text'
							},
							Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
							Description2Info: {
								location: modName,
								identifier: 'entityDescription2',
								initial: 'Description 2'
							},
							AccountNo: {location: modName, identifier: 'entityAccountNo', initial: 'Account No.'},
							BillingLineTypeFk: {
								location: modName,
								identifier: 'entityBillingLineTypeFk',
								initial: 'Type'
							},
							FinalTotal: {location: modName, identifier: 'entityFinalTotal', initial: 'Final'},
							GeneralsTypeFk: {
								location: modName,
								identifier: 'entityGeneralsTypeFk',
								initial: 'General Type'
							},
							IsHidden: {location: modName, identifier: 'entityIsHidden', initial: 'IsHidden'},
							IsHiddenIfZero: {
								location: modName,
								identifier: 'entityIsHiddenIfZero',
								initial: 'IsHiddenIfZero'
							},
							Group1: {location: modName, identifier: 'entityGroup1', initial: 'Group 1'},
							Group2: {location: modName, identifier: 'entityGroup2', initial: 'Group 2'},
							HasControllingUnit: {
								location: modName,
								identifier: 'entityHasControllingUnit',
								initial: 'Has Controlling Unit'
							},
							IsBold: {location: modName, identifier: 'entityIsBold', initial: 'Bold'},
							IsEditable: {location: modName, identifier: 'entityIsEditable', initial: 'Edit'},
							IsItalic: {location: modName, identifier: 'entityIsItalic', initial: 'Italic'},
							IsPrinted: {location: modName, identifier: 'entityIsPrinted', initial: 'Print'},
							IsTurnover: {location: modName, identifier: 'entityIsTurnover', initial: 'Turnover'},
							IsResetFI: {location: modName, identifier: 'entityIsResetFI', initial: 'Reset FI'},
							IsNetAdjusted: {location: modName, identifier: 'entityIsNetAdjusted', initial: 'Net Adjusted'},
							IsUnderline: {location: modName, identifier: 'entityIsUnderline', initial: 'Underline'},
							OffsetAccountNo: {
								location: modName,
								identifier: 'entityOffsetAccountNo',
								initial: 'Offset Account'
							},
							TaxCodeFk: {location: modName, identifier: 'entityTaxCodeFk', initial: 'Tax Code'},
							Value: {location: modName, identifier: 'entityValue', initial: 'Value'},
							BillingSchemaDetailFk: {
								location: modName,
								identifier: 'entityBillingSchemaDetailFk',
								initial: 'Billing Schema'
							},
							CredFactor: {location: modName, identifier: 'credFactor', initial: 'Cred Factor'},
							DebFactor: {location: modName, identifier: 'debFactor', initial: 'Deb Factor'},
							DetailAuthorAmountFk: {
								location: modName,
								identifier: 'billingschmdtlaafk',
								initial: 'Author.Amount Ref'
							},
							BillingSchemaDetailTaxFk: {
								location: modName,
								identifier: 'billingSchmDtlTaxFk',
								initial: 'Tax Ref'
							},
							CredLineTypeFk: {
								location: modName,
								identifier: 'creditorlinetype',
								initial: 'Treatment Cred'
							},
							DebLineTypeFk: {location: modName, identifier: 'debitorlinetype', initial: 'Treatment Deb'},
							CostLineTypeFk: {
								location: modName,
								identifier: 'costLineTypeFk',
								initial: 'Cost Line Type'
							},
							UserDefined1: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 1',
								param: {'p_0': '1'}
							},
							UserDefined2: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 2',
								param: {'p_0': '2'}
							},
							UserDefined3: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 3',
								param: {'p_0': '3'}
							},
							Formula: {location: cloudCommonModule, identifier: 'formula', initial: 'Formula'},
							CodeRetention: {location: modName, identifier: 'codeRetention', initial: 'Code Retention'},
							PaymentTermFk: {location: modName, identifier: 'paymentTerm', initial: 'Payment Term'},
							SqlStatement: {location: modName, identifier: 'sqlStatement', initial: 'Sql Statement'},
							Factor: {location: modName, identifier: 'factor', initial: 'Factor'},
						}
					},
					'overloads': {
						'billingschemadetailfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-billing-schema-billing-schema-detail-lookup',
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
									},
									directive: 'basics-billing-schema-billing-schema-detail-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BillingSchemaDetail',
									displayMember: 'Description'
								}
							}
						},
						'billinglinetypefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-billing-schema-billing-line-type-combobox',
								options: {
									filterKey: 'basics-billingschema-billing-line-type-filter'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-billing-schema-billing-line-type-combobox',
									lookupOptions: {
										filterKey: 'basics-billingschema-billing-line-type-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BillingLineType',
									displayMember: 'Description'
								}
							}
						},
						'taxcodefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-master-data-context-tax-code-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {showClearButton: true}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupField: 'TaxCodeFk',
									lookupOptions: {showClearButton: true},
									directive: 'basics-master-data-context-tax-code-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'TaxCode',
									displayMember: 'Code'
								}
							}
						},
						'generalstypefk': {
							'detail': {
								'type': 'directive',
								'directive': 'procurement-common-generals-type-combobox',
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
									},
									directive: 'procurement-common-generals-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcGeneralsType',
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},

						'detailauthoramountfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-billing-schema-billing-schema-detail-all-lookup',
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
									},
									directive: 'basics-billing-schema-billing-schema-detail-all-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BillingSchemaDetail',
									displayMember: 'Description'
								}
							}
						},
						'billingschemadetailtaxfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-billing-schema-billing-schema-detail-all-lookup',
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
									},
									'directive': 'basics-billing-schema-billing-schema-detail-all-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BillingSchemaDetail',
									displayMember: 'Description'
								}
							}
						},
						'credlinetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.creditorlinetype'),
						'deblinetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.debitorlinetype'),
						'costlinetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.costlinetype'),
						'formula': {
							maxLength: 255
						},
						'coderetention': {
							maxLength: 16
						},
						'paymenttermfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-payment-term-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PaymentTerm',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-payment-term-lookup'
								},
								width: 150
							}
						}
					},
					'addition': {
						'grid': [
							{
								'lookupDisplayColumn': true,
								'field': 'PaymentTermFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'basics.billingschema.paymentTermDes',
								'width': 180
							},
						]
					}
				};

				var basicsBiillingSchemaRubricCategoryLayout = {
					'fid': 'basics.billingSchema.RubricCategoryform',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['descriptioninfo']
						}
					]
				};

				service.getBasicsBillingSchemaLayout = function () {
					return basicsBillingSchemaLayout;
				};

				service.getBasicsBillingSchemaDetailLayout = function () {
					return basicsBillingSchemaDetailLayout;
				};

				service.getBasicsBiillingSchemaRubricCategoryLayout = function () {
					return basicsBiillingSchemaRubricCategoryLayout;
				};

				service.getLayouts = function () {
					return [
						basicsBillingSchemaLayout,
						basicsBillingSchemaDetailLayout,
						basicsBiillingSchemaRubricCategoryLayout
					];
				};

				return service;
			}
		]);
})(angular);