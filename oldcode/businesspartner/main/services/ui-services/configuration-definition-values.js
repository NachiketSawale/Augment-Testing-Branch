/**
 * Created by zos on 4/8/2015.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main',
		cloudCommonModule = 'cloud.common',
		billingSchemaModule = 'basics.billingschema',
		basicsCustomizeModule = 'basics.customize',
		basicsCommonModule = 'basics.common',
		prcCommonName = 'procurement.common',
		evaluationSchema = 'businesspartner.evaluationschema';
	// Activity
	angular.module(moduleName).factory('businesspartnerMainActivityLayout',
		['basicsLookupdataConfigGenerator',
			function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'businesspartner.main.activity.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['activitytypefk', 'activitydate', 'commenttext', 'clerkfk', 'remark', 'documenttypefk', 'documentname',
								'documentdate', 'originfilename', 'fromdate', 'companyfk', 'companyresponsiblefk', 'contactfk','reminderfrequency',
								'remindercyclefk','reminderstartdate','reminderenddate','isfinished']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [cloudCommonModule, moduleName],
						'extraWords': {
							ActivityTypeFk: {
								location: moduleName,
								identifier: 'activityType',
								initial: 'Activity Type'
							},
							IsFinished:{location: moduleName, identifier: 'finished', initial: 'Finished'},
							ReminderFrequency:{location: moduleName, identifier: 'ReminderFrequency', initial: 'Reminder Frequency'},
							ReminderCycleFk:{location: moduleName, identifier: 'ReminderCycleFk', initial: 'Reminder Cycle'},
							ReminderStartDate:{location: moduleName, identifier: 'ReminderStartDate', initial: 'Start Date'},
							ReminderEndDate:{location: moduleName, identifier: 'ReminderEndDate', initial: 'End Date'},
							ActivityDate: {location: moduleName, identifier: 'bpActivityDate', initial: 'Activity Date'},
							CommentText: {
								location: cloudCommonModule,
								identifier: 'entityCommentText',
								initial: 'Comment Text'
							},
							ClerkFk: {
								location: cloudCommonModule,
								identifier: 'entityResponsible',
								initial: 'Clerk Code'
							},
							Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
							DocumentTypeFk: {
								location: moduleName,
								identifier: 'documentType',
								initial: 'Document Type'
							},
							DocumentName: {location: moduleName, identifier: 'documentName', initial: 'Document Name'},
							DocumentDate: {location: moduleName, identifier: 'documentDate', initial: 'Document Date'},
							OriginFileName: {
								location: cloudCommonModule,
								identifier: 'documentOriginFileName',
								initial: 'File Name'
							},
							FromDate: {location: cloudCommonModule, identifier: 'fromDate', initial: 'From Date'},
							CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
							CompanyResponsibleFk: {location: moduleName, identifier: 'entityProfitCenter', initial: 'Profit Center'},
							ContactFk: {location: 'businesspartner.contact', identifier: 'contact', initial: 'Contact'},

						}
					},
					'overloads': {
						'remindercyclefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.remindercycle', null, {showClearButton: false}),
						'activitytypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.activity.type'),
						'clerkfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Code'
								},
								width: 100
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'model': 'ClerkFk',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},
						'documenttypefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-table-document-type-combobox',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'documentType',
									displayMember: 'Description'
								},
								width: 110
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-table-document-type-combobox',
								'model': 'DocumentTypeFk',
								'options': {
									descriptionMember: 'Description',
									showClearButton: true
								}
							}
						},
						'originfilename': {
							readonly: true
						},
						'companyfk': {
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
								'model': 'CompanyFk',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {}
								}
							},
							readonly: true
						},
						'contactfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-filtered-contact-combobox',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'business-partner-contact-filter-for-activity'
									}
								},
								width: 125,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'contact',
									displayMember: 'FullName'
								}
							},
							detail: {
								type: 'directive',
								directive: 'business-partner-main-filtered-contact-combobox',
								options: {
									initValueField: 'FullName',
									filterKey: 'business-partner-contact-filter-for-activity',
									showClearButton: true
								}
							}
						},
						'companyresponsiblefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup',
									lookupOptions: {filterKey: 'business-partner-activity-responsible-company-filter'}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'Code'
								},
								width: 200
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'model': 'CompanyResponsibleFk',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {filterKey: 'business-partner-activity-responsible-company-filter'}
								}
							}
						}
					},
					'addition': {
						'grid': [{
							'afterId': 'clerkfk',
							'id': 'clerkDescription',
							field: 'ClerkFk',
							name: 'Responsible Name',
							name$tr$: 'cloud.common.entityResponsibleName',
							sortable: true,
							width: 100,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'clerk',
								displayMember: 'Description'
							}
						},
						{
							'afterId': 'companyfk',
							id: 'CompanyName',
							field: 'CompanyFk',
							name: 'Company Name',
							name$tr$: 'cloud.common.entityCompanyName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 150
						},
						{
							'afterId': 'companyresponsiblefk',
							id: 'ResponsibleCompanyName',
							field: 'CompanyResponsibleFk',
							name: 'Profit Center Name',
							name$tr$: 'businesspartner.main.entityProfitCenterName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 250
						}]
					}
				};
			}
		]);

	// Agreement
	angular.module(moduleName).factory('businesspartnerMainAgreementLayout',
		['basicsLookupdataConfigGenerator',
			function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'businesspartner.main.agreement.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['agreementtypefk', 'description', 'referencedate', 'reference', 'commenttext',
								'remark', 'validfrom', 'validto', 'documenttypefk', 'documentname', 'documentdate',
								'originfilename']
						},
						{
							'gid': 'userDefined',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							userDefined: {
								location: moduleName,
								identifier: 'groupUserDefined',
								initial: 'User Defined Fields'
							},
							AgreementTypeFk: {
								location: basicsCustomizeModule,
								identifier: 'bpagreementtype',
								initial: 'Agreement Type'
							},
							Description: {
								location: cloudCommonModule,
								identifier: 'entityDescription',
								initial: 'Description'
							},
							ReferenceDate: {
								location: moduleName,
								identifier: 'entityReferenceDate',
								initial: 'Reference Date'
							},
							Reference: {
								location: cloudCommonModule,
								identifier: 'entityReference',
								initial: 'Reference'
							},
							CommentText: {
								location: cloudCommonModule,
								identifier: 'entityCommentText',
								initial: 'Comment Text'
							},
							Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
							ValidFrom: {
								location: cloudCommonModule,
								identifier: 'entityValidFrom',
								initial: 'Valid From'
							},
							ValidTo: {location: cloudCommonModule, identifier: 'entityValidTo', initial: 'Valid To'},
							DocumentTypeFk: {
								location: moduleName,
								identifier: 'documentType',
								initial: 'Document Type'
							},
							DocumentName: {location: moduleName, identifier: 'documentName', initial: 'Document Name'},
							DocumentDate: {location: moduleName, identifier: 'documentDate', initial: 'Document Date'},
							OriginFileName: {
								location: cloudCommonModule,
								identifier: 'documentOriginFileName',
								initial: 'File Name'
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
							UserDefined4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 4',
								param: {'p_0': '4'}
							},
							UserDefined5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 5',
								param: {'p_0': '5'}
							}
						}
					},
					'overloads': {
						'agreementtypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.agreement.type'),
						'documenttypefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-table-document-type-combobox',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'documentType',
									displayMember: 'Description'
								},
								width: 110
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-table-document-type-combobox',
								'model': 'DocumentTypeFk',
								'options': {
									descriptionMember: 'Description',
									showClearButton: true
								}
							}
						},
						'originfilename': {
							readonly: true
						}
					}
				};
			}
		]);

	// Bank
	angular.module(moduleName).factory('businesspartnerMainBankLayout',
		['basicsLookupdataConfigGenerator',
			function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'businesspartner.main.bank.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['bpdbankstatusfk', 'islive', 'banktypefk', 'bankfk', 'iban', 'accountno', 'countryfk', 'isdefault', 'companyfk',
								'isdefaultcustomer']
						},
						{
							'gid': 'userDefined',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName, basicsCommonModule],
						'extraWords': {
							userDefined: {location: moduleName, identifier: 'groupUserDefined', initial: 'User Defined Fields'},
							IsLive: {location: moduleName, identifier: 'isLive', initial: 'Is Live'},
							BankTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
							BankFk: {location: cloudCommonModule, identifier: 'entityBankName', initial: 'Bank'},
							Iban: {location: cloudCommonModule, identifier: 'entityBankIBan', initial: 'IBAN'},
							AccountNo: {
								location: cloudCommonModule,
								identifier: 'entityBankAccountNo',
								initial: 'Account No.'
							},
							CountryFk: {location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country'},
							CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
							UserDefined1: {location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: '1'}, initial: 'User Defined 1'},
							UserDefined2: {location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: '2'}, initial: 'User Defined 2'},
							UserDefined3: {location: cloudCommonModule, identifier: 'entityUserDefined', param: {p_0: '3'}, initial: 'User Defined 3'},
							BpdBankStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'test Status'},
							IsDefaultCustomer: {location: moduleName, identifier: 'bankIsDefaultCustomer', initial: 'Is Default Customer'}
						}
					},
					'overloads': {
						'iban': {
							grid: {
								bulkSupport: false
							}
						},
						'banktypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.bank.type'),
						'bankfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-bank-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Bank',
									displayMember: 'BankName'
								},
								width: 100
							},
							'detail': {
								'model': 'BankFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-bank-lookup',
								'options': {
									displayMember: 'BankName'
								}
							}
						},
						'countryfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.country'),
						'companyfk': {
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
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {}
								}
							}
						},
						'bpdbankstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.bpbankstatus', null, {showIcon: true}),
						'isdefault': {
							'grid': {
								name: 'Is Default Supplier',
								name$tr$: moduleName + '.bankIsDefaultSupplier'
							},
							'detail': {
								'label': 'Is Default Supplier',
								'label$tr$': moduleName + '.bankIsDefaultSupplier'
							}
						}
					},
					'addition': {
						'grid': [
							{
								'afterId': 'bankfk',
								id: 'bankCountryIso2',
								field: 'BankFk',
								name: 'ISO2',
								name$tr$: 'cloud.common.entityISO2',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Bank',
									displayMember: 'Iso2'
								}
							},
							{
								'afterId': 'bankCountryIso2',
								id: 'bankBic',
								field: 'BankFk',
								name: 'Bic',
								name$tr$: 'cloud.common.entityBankBic',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Bank',
									displayMember: 'Bic'
								}
							},
							{
								'afterId': 'bankBic',
								id: 'bankSortCode',
								field: 'BankFk',
								name: 'Sort Code',
								name$tr$: 'cloud.common.entityBankSortCode',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Bank',
									displayMember: 'SortCode'
								}
							},
							{
								'afterId': 'bankSortCode',
								id: 'bankCity',
								field: 'BankFk',
								name: 'City',
								name$tr$: 'cloud.common.entityCity',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Bank',
									displayMember: 'City'
								}
							}
						],
						'detail': [
							{
								'afterId': 'bankfk',
								'rid': 'bankCountryIso2',
								'gid': 'basicData',
								'label': 'ISO2',
								'label$tr$': 'cloud.common.entityISO2',
								'model': 'BankFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-bank-lookup',
								'options': {
									displayMember: 'Iso2',
									readOnly: true
								}
							},
							{
								'afterId': 'bankISO2',
								'rid': 'bankBic',
								'gid': 'basicData',
								'label': 'Bic',
								'label$tr$': 'cloud.common.entityBankBic',
								'model': 'BankFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-bank-lookup',
								'options': {
									displayMember: 'Bic',
									readOnly: true
								}
							},
							{
								'afterId': 'bankBic',
								'rid': 'bankSortCode',
								'gid': 'basicData',
								'label': 'Sort Code',
								'label$tr$': 'cloud.common.entityBankSortCode',
								'model': 'BankFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-bank-lookup',
								'options': {
									displayMember: 'SortCode',
									readOnly: true
								}
							},
							{
								'afterId': 'bankSortCode',
								'rid': 'bankCity',
								'gid': 'basicData',
								'label': 'City',
								'label$tr$': 'cloud.common.entityCity',
								'model': 'BankFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-bank-lookup',
								'options': {
									displayMember: 'City',
									readOnly: true
								}
							}
						]
					}
				};
			}
		]);

	// Header
	angular.module(moduleName).factory('businesspartnerMainHeaderLayout',
		['$injector', 'basicsCommonComplexFormatter', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'basicsCommonCommunicationFormatter', 'businessPartnerCustomFormatters',
			function ($injector, complexFormatter, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, communicationFormatter, businessPartnerCustomFormatters) {
				return {
					'fid': 'businesspartner.main.master.data',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['titlefk', 'businesspartnerstatusfk', 'businesspartnerstatus2fk', 'businesspartnername1', 'businesspartnername2', 'businesspartnername3', 'businesspartnername4', 'tradename', 'matchcode', 'companyfk', 'clerkfk', 'customerabcfk', 'customersectorfk',
								'customerstatusfk', 'customergroupfk', 'avaid', 'creditstandingfk', 'hasframeworkagreement', 'remarkmarketing', 'remark1', 'remark2', 'prcincotermfk', 'islive','code','rubriccategoryfk', 'isframework','activeframeworkcontract','id']
						},
						{
							'gid': 'communication',
							'attributes': ['internet', 'email']
						},
						{
							'gid': 'externalIdentities',
							'attributes': ['crefono', 'bedirektno', 'dunsno', 'vatno', 'taxno', 'taxofficecode', 'vatnoeu', 'vatcountryfk','biidnr']
						},
						{
							'gid': 'other',
							'attributes': ['traderegisterno', 'traderegister', 'customerbranchfk', 'traderegisterdate',
								'craftcooperative', 'craftcooperativetype', 'craftcooperativedate', 'isnationwide', 'legalformfk']
						},
						{
							'gid': 'userDefined',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'refvalue1', 'refvalue2']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							communication: {
								location: moduleName,
								identifier: 'groupCommunication',
								initial: 'Communication'
							},
							externalIdentities: {
								location: moduleName,
								identifier: 'groupExternalIdentities',
								initial: 'External Identities'
							},
							userDefined: {
								location: moduleName,
								identifier: 'groupUserDefined',
								initial: 'User Defined Fields'
							},
							others: {
								location: moduleName,
								identifier: 'groupOther',
								initial: 'Other'
							},
							TitleFk: {location: moduleName, identifier: 'title', initial: 'Title'},
							BusinessPartnerStatusFk: {
								location: cloudCommonModule,
								identifier: 'entityState',
								initial: 'Status'
							},
							BusinessPartnerStatus2Fk: {
								location: moduleName,
								identifier: 'entityStatus2',
								initial: 'Status2'
							},
							Id:{location: moduleName, identifier: 'EntityId', initial: 'Id'},
							RubricCategoryFk:{location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk', initial: 'Rubric Category'},
							Code:{location: cloudCommonModule, identifier: 'code', initial: 'Code'},
							BusinessPartnerName1: {location: moduleName, identifier: 'name1', initial: 'Name'},
							BusinessPartnerName2: {location: moduleName, identifier: 'name2', initial: 'Name Affix'},
							BusinessPartnerName3: {location: moduleName, identifier: 'name3', initial: 'Name 3'},
							BusinessPartnerName4: {location: moduleName, identifier: 'name4', initial: 'Name 4'},
							TradeName: {location: moduleName, identifier: 'tradeName', initial: 'Trade Name'},
							MatchCode: {location: moduleName, identifier: 'matchCode', initial: 'Match Code'},
							CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
							ClerkFk: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
							CustomerAbcFk: {location: basicsCustomizeModule, identifier: 'customerabc', initial: 'ABC Classification'},
							CustomerSectorFk: {location: basicsCustomizeModule, identifier: 'customersector', initial: 'Sector'},
							CustomerStatusFk: {
								location: basicsCustomizeModule,
								identifier: 'customerstate',
								initial: 'Customer Status'
							},
							CustomerGroupFk: {location: moduleName, identifier: 'customerGroup', initial: 'Group'},
							RefValue1: {location: moduleName, identifier: 'referenceValue1', initial: 'Reference Value1'},
							RefValue2: {location: moduleName, identifier: 'referenceValue2', initial: 'Reference Value2'},
							Internet: {location: moduleName, identifier: 'internet', initial: 'Internet'},
							Email: {location: moduleName, identifier: 'email', initial: 'E-mail'},
							CrefoNo: {location: moduleName, identifier: 'creFoNo', initial: 'Crefo No.'},
							BedirektNo: {location: moduleName, identifier: 'beDirectNo', initial: 'BeDirect No.'},
							DunsNo: {location: moduleName, identifier: 'dunsNo', initial: 'D-U-N-S No.'},
							VatNo: {location: moduleName, identifier: 'vatNo', initial: 'Vat No.'},
							TaxNo: {location: moduleName, identifier: 'taxNo', initial: 'Tax No.'},
							TaxOfficeCode: {location: moduleName, identifier: 'taxOfficeCode', initial: 'Tax Office No.'},
							VatNoEu: {location: moduleName, identifier: 'vatNoEu', initial: 'Vat No.EU'},
							VatCountryFk: {location: moduleName, identifier: 'vatCountryFk', initial: 'Vat Country'},
							BiIdnr: {location: moduleName, identifier: 'biIdnr', initial: 'BI-IDNr'},
							IsLive: {location: moduleName, identifier: 'bpIsLive', initial: 'Active'},
							TradeRegisterNo: {
								location: moduleName,
								identifier: 'tradeRegisterNo',
								initial: 'Trade Register No.'
							},
							TradeRegister: {location: moduleName, identifier: 'tradeRegister', initial: 'Trade Register'},
							CustomerBranchFk: {
								location: moduleName,
								identifier: 'customerBranchCode',
								initial: 'Branch Code'
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
							UserDefined4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 4',
								param: {'p_0': '4'}
							},
							UserDefined5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 5',
								param: {'p_0': '5'}
							},
							TradeRegisterDate: {
								location: moduleName,
								identifier: 'tradeRegisterDate',
								initial: 'Trade Register Date'
							},
							CraftCooperative: {
								location: moduleName,
								identifier: 'craftCooperative',
								initial: 'Craft Cooperative'
							},
							CraftCooperativeType: {
								location: moduleName,
								identifier: 'craftCooperativeType',
								initial: 'Craft Cooperative Type'
							},
							CraftCooperativeDate: {
								location: moduleName,
								identifier: 'craftCooperativeDate',
								initial: 'Craft Cooperative Date'
							},
							IsNationwide: {location: moduleName, identifier: 'isNationwide', initial: 'Is Nationwide'},
							LegalFormFk: {location: moduleName, identifier: 'legalForm', initial: 'Legal Form'},
							Avaid: {location: moduleName, identifier: 'Avaid', initial: 'AVAID'},
							AvgEvaluationA: {
								location: moduleName,
								identifier: 'avgEvaluationA',
								initial: 'Avg. Evaluation Group A'
							},
							CountEvaluationA: {
								location: moduleName,
								identifier: 'countEvaluationA',
								initial: 'No. of Eval. A'
							},
							AvgEvaluationB: {
								location: moduleName,
								identifier: 'avgEvaluationB',
								initial: 'Avg. Evaluation Group B'
							},
							CountEvaluationB: {
								location: moduleName,
								identifier: 'countEvaluationB',
								initial: 'No. of Eval. B'
							},
							AvgEvaluationC: {
								location: moduleName,
								identifier: 'avgEvaluationC',
								initial: 'Avg. Evaluation Group C'
							},
							CountEvaluationC: {
								location: moduleName,
								identifier: 'countEvaluationC',
								initial: 'No. of Eval. C'
							},
							CreditstandingFk: {
								location: moduleName,
								identifier: 'CreditstandingFk',
								initial: 'Credit Standing'
							},
							HasFrameworkAgreement: {
								location: moduleName,
								identifier: 'HasFrameworkAgreement',
								initial: 'Has Material Catalog'
							},
							RemarkMarketing: {
								location: moduleName,
								identifier: 'marketingContainerTitle',
								initial: 'Marketing'
							},
							Remark1: {
								location: moduleName,
								identifier: 'remark1Field',
								initial: 'Remark1'
							},
							Remark2: {
								location: moduleName,
								identifier: 'remark2Field',
								initial: 'Remark2'
							},
							PrcIncotermFk: {
								location: cloudCommonModule,
								identifier: 'entityIncoterms',
								initial: 'Incoterms'
							},
							IsFrameWork: {
								location: moduleName,
								identifier: 'isframework',
								initial: 'Has Framework Agreement'
							},
							ActiveFrameworkContract:{
								location: moduleName,
								identifier: 'activeframeworkcontract',
								initial: 'Active Framework Contract'
							}
						}
					},
					'overloads': {
						'rubriccategoryfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									lookupOptions: {
										filterKey: 'businesspartner-main-rubric-category-lookup-filter',
										showClearButton: true,
										disableDataCaching: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									'lookupType': 'RubricCategoryByRubricAndCompany',
									'displayMember': 'Description'
								},
								width: 125,
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: 'businesspartner-main-rubric-category-lookup-filter',
										showClearButton: true,
										disableDataCaching: true
									}
								}
							}
						},
						'id': {readonly: true},
						'refvalue1': {readonly: true},
						'refvalue2': {readonly: true},
						'islive': {readonly: true},
						'tradename': {
							maxLength: 60
						},
						'titlefk': // basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.lookup.title', null, {showClearButton: true}),
							{
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-title-combobox',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'title',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 110
								},
								'detail': {
									type: 'directive',
									directive: 'basics-lookupdata-title-combobox',
									options: {
										displayMember: 'DescriptionInfo.Translated'
									}
								}
							},
						'businesspartnerstatusfk': {
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BusinessPartnerStatus',
									displayMember: 'Description',
									imageSelector: 'platformStatusIconService'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-status-combobox',
								'options': {
									readOnly: true,
									imageSelector: 'platformStatusIconService'
								}
							},
							readonly: true
						},
						'businesspartnerstatus2fk': {
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BusinessPartnerStatus2',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-status2-combobox',
								'options': {
									readOnly: true,
									imageSelector: 'platformStatusIconService'
								}
							},
							readonly: true
						},
						'matchcode': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'business-partner-main-match-code-input',
									lookupOptions: {
										showClearButton: true,
										maxLen: businessPartnerCustomFormatters.getCustomizeMaxLen('MatchCode')
									}
								},
								formatter: 'description',
								bulkSupport: false
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-match-code-input',
								'options': {
									maxLen: businessPartnerCustomFormatters.getCustomizeMaxLen('MatchCode')
								},
							}
						},
						'companyfk': {
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
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {}
								}
							}
						},
						'clerkfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'cloud-clerk-clerk-dialog',
									lookupOptions: {showClearButton: true}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Code'
								},
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},
						'customerabcfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.customerabc', null, {showIcon: true}),
						'customersectorfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.customersector', null, {showClearButton: true}),
						'customerstatusfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-customer4-bp-status-combobox',
									lookupOptions: {showClearButton: true}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'customerStatus4BusinessParnter',
									displayMember: 'Description'
								},
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-customer4-bp-status-combobox',
								'options': {showClearButton: true}
							}
						},
						'customergroupfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.customergroup', null, {showClearButton: true}),
						'customerbranchfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-customer-branch-lookup',
									lookupOptions: {showClearButton: true}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'customerBranch',
									displayMember: 'Code'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'business-partner-main-customer-branch-lookup',
									descriptionMember: 'Description',
									lookupOptions: {showClearButton: true}
								}
							}
						},
						'creditstandingfk': // basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.creditstanding', null, {showClearButton: true}),
							{
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										directive: 'business-partner-main-creditstanding-lookup',
										lookupOptions: {
											showClearButton: true
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'creditstanding',
										displayMember: 'DescriptionInfo.Description'
									},
									grouping: false
								},
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-creditstanding-lookup',
									'options': {
										showClearButton: true
									}
								}
							},
						'legalformfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-legal-form-directive',
									lookupOptions: {
										filterKey: 'business-partner-main-legal-form-filter',
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'legalForm',
									displayMember: 'DescriptionInfo.Translated'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-legal-form-directive',
								'options': {
									filterKey: 'business-partner-main-legal-form-filter',
									showClearButton: true
								}
							}
						},
						'internet': {
							'grid': {
								editor: 'url',
								formatter: 'url',
								bulkSupport: false
							},
							'detail': {
								'type': 'url'
							}
						},
						'dunsno': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'bisnode-dunsno-input'
								},
								formatter: 'description',
								width: 150,
								bulkSupport: false
							},
							'detail': {
								type: 'directive',
								directive: 'bisnode-dunsno-input'
							}
						},
						'vatcountryfk':
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCountryLookupDataService',
								enableCache: true
							}),
						'email': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'basics-common-email-input',
									dataServiceName: 'businesspartnerMainHeaderDataService'
								},
								formatter: communicationFormatter,
								formatterOptions: {
									domainType: 'email'
								},
								width: 150,
								bulkSupport: false
							},
							'detail': {
								type: 'directive',
								directive: 'basics-common-email-input',
								dataServiceName: 'businesspartnerMainHeaderDataService'
							}
						},
						'prcincotermfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									showClearButton: true,
									lookupDirective: 'basics-lookupdata-incoterm-combobox',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupField: 'PrcIncotermFk',
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-incoterm-combobox'
								},
								width: 125,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prcincoterm',
									displayMember: 'Code'
								}
							}
						},
						'isframework':{
							readonly: true
						},
						'activeframeworkcontract':{
							readonly:true
						}
					},
					'addition': {
						'grid': [
							{
								'afterId': 'clerkfk',
								'id': 'ClerkDescription',
								'field': 'ClerkFk',
								'name': 'Responsible Name',
								'name$tr$': 'cloud.common.entityResponsibleName',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Description'
								},
								width: 140
							},
							{
								'afterId': 'companyfk',
								'id': 'CompanyName',
								field: 'CompanyFk',
								'name': 'Company Name',
								'name$tr$': 'cloud.common.entityCompanyName',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'CompanyName'
								},
								width: 140
							},
							{
								'afterId': 'email',
								'id': 'address',
								field: 'SubsidiaryDescriptor.AddressDto',
								'name': 'Address',
								'name$tr$': 'cloud.common.entityAddress',
								sortable: true,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-address-dialog',
									lookupOptions: {
										titleField: 'cloud.common.entityAddress',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'AddressLine'
								}
							},
							{
								'afterId': 'address',
								'id': 'street',
								field: 'SubsidiaryDescriptor.AddressDto.Street',
								'name': 'Street',
								'name$tr$': 'cloud.common.entityStreet',
								sortable: true,
								formatter: complexFormatter
							},
							{
								'afterId': 'street',
								'id': 'city',
								field: 'SubsidiaryDescriptor.AddressDto.City',
								'name': 'City',
								'name$tr$': 'cloud.common.entityCity',
								sortable: true,
								formatter: complexFormatter

							},
							{
								'afterId': 'city',
								'id': 'zipCode',
								field: 'SubsidiaryDescriptor.AddressDto.ZipCode',
								'name': 'entityZipCode',
								'name$tr$': 'cloud.common.entityZipCode',
								sortable: true,
								formatter: complexFormatter
							},
							{
								'afterId': 'zipCode',
								'id': 'country',
								field: 'SubsidiaryDescriptor.AddressDto.CountryISO2',
								'name': 'Country',
								'name$tr$': 'cloud.common.entityCountry',
								sortable: true,
								formatter: complexFormatter
							},
							{
								'afterId': 'country',
								'id': 'countryDesc',
								field: 'SubsidiaryDescriptor.AddressDto.CountryDescription',
								'name': 'Country Description',
								'name$tr$': 'basics.common.entityCountryDescription',
								sortable: true,
								formatter: complexFormatter
							},
							{
								'afterId': 'countryDesc',
								'id': 'telephone',
								field: 'SubsidiaryDescriptor.TelephoneNumber1Dto',
								'name': 'Telephone Number',
								'name$tr$': 'businesspartner.main.telephoneNumber',
								sortable: true,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										test: 'SubsidiaryDescriptor.TelephoneNumber1Fk',
										titleField: 'businesspartner.main.telephoneNumber',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								},
								width: 140
							},
							{
								'afterId': 'telephone',
								'id': 'telephone2',
								field: 'SubsidiaryDescriptor.TelephoneNumber2Dto',
								'name': 'Other Tel.',
								'name$tr$': 'businesspartner.main.telephoneNumber2',
								sortable: true,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										titleField: 'businesspartner.main.telephoneNumber2',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								},
								width: 140
							},
							{
								'afterId': 'telephone2',
								'id': 'telefax',
								field: 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto',
								'name': 'Telefax',
								'name$tr$': 'businesspartner.main.telephoneFax',
								sortable: true,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										titleField: 'businesspartner.main.telephoneFax',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							},
							{
								'afterId': 'telefax',
								'id': 'mobile',
								field: 'SubsidiaryDescriptor.TelephoneNumberMobileDto',
								'name': 'Mobile Number',
								'name$tr$': 'businesspartner.main.mobileNumber',
								sortable: true,
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										titleField: 'businesspartner.main.mobileNumber',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								}
							},
							{
								'afterId': 'mobile',
								'id': 'languageFk',
								'field': 'LanguageFk',
								'name': 'Language',
								'name$tr$': 'basics.customize.language',
								'sortable': true,
								'editor': 'lookup',
								'editorOptions': {
									lookupOptions: {
										lookupModuleQualifier: 'basics.customize.language',
										displayMember: 'Description',
										valueMember: 'Id',
										showClearButton: true
									},
									directive: 'basics-lookupdata-simple'
								},
								'formatter': 'lookup',
								'formatterOptions': {
									lookupSimpleLookup: true,
									lookupModuleQualifier: 'basics.customize.language',
									displayMember: 'Description',
									valueMember: 'Id',
									lookupType: 'basics.customize.language',
									showClearButton: true
								}
							},
							{
								'afterId': 'languageFk',
								'id': 'communicationChannelFk',
								'field': 'CommunicationChannelFk',
								'name': 'Communication Channel',
								'name$tr$': 'basics.customize.communicationchannel',
								'sortable': true,
								'editor': 'lookup',
								'editorOptions': {
									lookupOptions: {
										lookupModuleQualifier: 'basics.customize.communicationchannel',
										displayMember: 'Description',
										valueMember: 'Id',
										showClearButton: true
									},
									directive: 'basics-lookupdata-simple'
								},
								'formatter': 'lookup',
								'formatterOptions': {
									lookupSimpleLookup: true,
									lookupModuleQualifier: 'basics.customize.communicationchannel',
									displayMember: 'Description',
									valueMember: 'Id',
									lookupType: 'basics.customize.communicationchannel',
									showClearButton: true
								}
							},
							{
								'afterId': 'communicationChannelFk',
								'id': 'salutation',
								'field': 'Salutation',
								'name': 'Salutation',
								'name$tr$': 'basics.customize.salutation',
								sortable: true,
								editor: 'comment',
								formatter: 'comment'
							},
							{
								'afterId': 'customerbranchfk',
								'id': 'customerBranchDesc',
								field: 'CustomerBranchFk',
								name$tr$: 'businesspartner.main.customerBranch',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'customerBranch',
									displayMember: 'Description'
								}
							},
							{
								'afterId': 'customerBranchDesc',
								'id': 'avgEvaluationA',
								'field': 'AvgEvaluationA',
								name$tr$: 'businesspartner.main.avgEvaluationA',
								sortable: true,
								formatter: function (row, cell, value) {
									return '<div class="text-right">' + Math.round(value) + '</div>';
								}
							},
							{
								'afterId': 'avgEvaluationA',
								'id': 'countEvaluationA',
								'field': 'CountEvaluationA',
								name$tr$: 'businesspartner.main.countEvaluationA',
								sortable: true,
								formatter: 'integer'
							},
							{
								'afterId': 'countEvaluationA',
								'id': 'avgEvaluationB',
								'field': 'AvgEvaluationB',
								name$tr$: 'businesspartner.main.avgEvaluationB',
								sortable: true,
								formatter: function (row, cell, value) {
									return '<div class="text-right">' + Math.round(value) + '</div>';
								}
							},
							{
								'afterId': 'avgEvaluationB',
								'id': 'countEvaluationB',
								'field': 'CountEvaluationB',
								name$tr$: 'businesspartner.main.countEvaluationB',
								sortable: true,
								formatter: 'integer'
							},
							{
								'afterId': 'countEvaluationB',
								'id': 'avgEvaluationC',
								'field': 'AvgEvaluationC',
								name$tr$: 'businesspartner.main.avgEvaluationC',
								sortable: true,
								formatter: function (row, cell, value) {
									return '<div class="text-right">' + Math.round(value) + '</div>';
								}
							},
							{
								'afterId': 'avgEvaluationC',
								'id': 'countEvaluationC',
								'field': 'CountEvaluationC',
								name$tr$: 'businesspartner.main.countEvaluationC',
								sortable: true,
								formatter: 'integer'
							},
							{
								'lookupDisplayColumn': true,
								'field': 'PrcIncotermFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'cloud.common.entityIncotermCodeDescription',
								'width': 120
							},
						],
						'detail': [
							{
								'afterId': 'email',
								'rid': 'address',
								'gid': 'communication',
								'model': 'SubsidiaryDescriptor.AddressDto',
								'label': 'Address',
								'label$tr$': 'cloud.common.entityAddress',
								'type': 'directive',
								'directive': 'basics-common-address-dialog',
								'options': {
									titleField: 'cloud.common.entityAddress',
									foreignKey: 'SubsidiaryDescriptor.AddressFk',
									showClearButton: true
								}
							},
							{
								'afterId': 'address',
								'rid': 'street',
								'gid': 'communication',
								'model': 'SubsidiaryDescriptor.AddressDto.Street',
								'label': 'Street',
								'label$tr$': 'cloud.common.entityStreet',
								'type': 'comment',
								'readonly': true
							},
							{
								'afterId': 'street',
								'rid': 'city',
								'gid': 'communication',
								'type': 'description',
								'model': 'SubsidiaryDescriptor.AddressDto.City',
								'label': 'City',
								'label$tr$': 'cloud.common.entityCity',
								'readonly': true
							},
							{
								'afterId': 'city',
								'rid': 'zipCode',
								'gid': 'communication',
								'type': 'description',
								'model': 'SubsidiaryDescriptor.AddressDto.ZipCode',
								'label': 'Zip Code',
								'label$tr$': 'cloud.common.entityZipCode',
								'readonly': true
							},
							{
								'afterId': 'zipCode',
								'rid': 'country',
								'gid': 'communication',
								'type': 'description',
								'model': 'SubsidiaryDescriptor.AddressDto.CountryISO2',
								'label': 'Country',
								'label$tr$': 'cloud.common.entityCountry',
								'readonly': true
							},
							{
								'afterId': 'country',
								'rid': 'countryDesc',
								'gid': 'communication',
								'type': 'description',
								'model': 'SubsidiaryDescriptor.AddressDto.CountryDescription',
								'label': 'Country Description',
								'label$tr$': 'basics.common.entityCountryDescription',
								'readonly': true
							},
							{
								'afterId': 'countryDesc',
								'rid': 'telephone',
								'gid': 'communication',
								'type': 'directive',
								'model': 'SubsidiaryDescriptor.TelephoneNumber1Dto',
								'label': 'Telephone Number',
								'label$tr$': 'businesspartner.main.telephoneNumber',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.telephoneNumber',
									showClearButton: true
								}
							},
							{
								'afterId': 'telephone',
								'rid': 'telephone2',
								'gid': 'communication',
								'type': 'directive',
								'model': 'SubsidiaryDescriptor.TelephoneNumber2Dto',
								'label': 'Other Tel.',
								'label$tr$': 'businesspartner.main.telephoneNumber2',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.telephoneNumber2',
									showClearButton: true
								}
							},
							{
								'afterId': 'telephone2',
								'rid': 'telefax',
								'gid': 'communication',
								'type': 'directive',
								'model': 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto',
								'label': 'Telefax',
								'label$tr$': 'businesspartner.main.telephoneFax',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.telephoneFax',
									showClearButton: true
								}
							},
							{
								'afterId': 'telefax',
								'rid': 'mobile',
								'gid': 'communication',
								'type': 'directive',
								'model': 'SubsidiaryDescriptor.TelephoneNumberMobileDto',
								'label': 'Mobile Number',
								'label$tr$': 'businesspartner.main.mobileNumber',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.mobileNumber',
									showClearButton: true
								}
							},
							{
								'afterId': 'mobile',
								'rid': 'languageFk',
								'gid': 'communication',
								'type': 'directive',
								'model': 'LanguageFk',
								'label': 'Language',
								'label$tr$': 'basics.customize.language',
								'directive': 'basics-lookupdata-simple',
								'options': {
									lookupType: 'basics.customize.language',
									lookupModuleQualifier: 'basics.customize.language',
									displayMember: 'Description',
									valueMember: 'Id',
									showClearButton: true
								}
							},
							{
								'afterId': 'languageFk',
								'rid': 'communicationChannelFk',
								'gid': 'communication',
								'type': 'directive',
								'model': 'CommunicationChannelFk',
								'label': 'Communication Channel',
								'label$tr$': 'basics.customize.communicationchannel',
								'directive': 'basics-lookupdata-simple',
								'options': {
									lookupType: 'basics.customize.communicationchannel',
									lookupModuleQualifier: 'basics.customize.communicationchannel',
									displayMember: 'Description',
									valueMember: 'Id',
									showClearButton: true
								}
							},
							{
								'afterId': 'communicationChannelFk',
								'rid': 'salutation',
								'gid': 'communication',
								'type': 'comment',
								'model': 'Salutation',
								'label': 'Salutation',
								'label$tr$': 'basics.customize.salutation',
								'readonly': false
							},
							{
								'afterId': 'salutation',
								'rid': 'avgEvaluationA',
								'gid': 'other',
								'type': 'integer',
								'model': 'AvgEvaluationA',
								'label$tr$': 'businesspartner.main.avgEvaluationA',
								'label': 'Avg. Evaluation Group A',
								'readonly': true
							},
							{
								'afterId': 'avgEvaluationA',
								'rid': 'countEvaluationA',
								'gid': 'other',
								'type': 'integer',
								'model': 'CountEvaluationA',
								'label$tr$': 'businesspartner.main.countEvaluationA',
								'label': 'No. of Eval. A',
								'readonly': true
							},
							{
								'afterId': 'countEvaluationA',
								'rid': 'avgEvaluationB',
								'gid': 'other',
								'type': 'integer',
								'model': 'AvgEvaluationB',
								'label$tr$': 'businesspartner.main.avgEvaluationB',
								'label': 'Avg. Evaluation Group B',
								'readonly': true
							},
							{
								'afterId': 'avgEvaluationB',
								'rid': 'countEvaluationB',
								'gid': 'other',
								'type': 'integer',
								'model': 'CountEvaluationB',
								'label$tr$': 'businesspartner.main.countEvaluationB',
								'label': 'No. of Eval. B',
								'readonly': true
							},
							{
								'afterId': 'countEvaluationB',
								'rid': 'avgEvaluationC',
								'gid': 'other',
								'type': 'integer',
								'model': 'AvgEvaluationC',
								'label$tr$': 'businesspartner.main.avgEvaluationC',
								'label': 'Avg. Evaluation Group C',
								'readonly': true
							},
							{
								'afterId': 'avgEvaluationC',
								'rid': 'countEvaluationC',
								'gid': 'other',
								'type': 'integer',
								'model': 'CountEvaluationC',
								'label$tr$': 'businesspartner.main.countEvaluationC',
								'label': 'No. of Eval. C',
								'readonly': true
							}
						]
					}
				};
			}]);

	// BusinessPartner2Company
	angular.module(moduleName).factory('businessPartnerMainBusinessPartner2CompanyLayout', [
		function () {
			return {
				'fid': 'businesspartner.main.businesspartnertocompany.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['companyfk', 'companyresponsiblefk', 'remark', 'basclerkfk', 'isactive']
					},
					{
						'gid': 'userDefined',
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
						userDefined: {
							location: moduleName,
							identifier: 'groupUserDefined',
							initial: 'User Defined Fields'
						},
						CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
						CompanyResponsibleFk: {
							location: moduleName,
							identifier: 'companyResponsibleCompany',
							initial: 'Responsible Profit Centre'
						},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'},
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
						BasClerkFk: {
							location: cloudCommonModule,
							identifier: 'entityResponsible',
							initial: 'Clerk Code'
						},
						IsActive: {
							location: cloudCommonModule,
							identifier: 'entityIsActive',
							initial: 'IsActive'
						}
					}
				},
				'overloads': {
					'companyfk': {
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
							'model': 'CompanyFk',
							'options': {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
								lookupOptions: {}
							}
						}
					},
					'companyresponsiblefk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-company-company-lookup',
								lookupOptions: {filterKey: 'business-partner-to-company-responsible-company-filter'}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'Code'
							},
							width: 200
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'CompanyResponsibleFk',
							'options': {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
								lookupOptions: {filterKey: 'business-partner-to-company-responsible-company-filter'}
							}
						}
					},
					'basclerkfk': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'clerk',
								displayMember: 'Code'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							model: 'BasClerkFk',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'companyfk',
							id: 'CompanyName',
							field: 'CompanyFk',
							name: 'Company Name',
							name$tr$: 'cloud.common.entityCompanyName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 150
						},
						{
							'afterId': 'companyresponsiblefk',
							id: 'ResponsibleCompanyName',
							field: 'CompanyResponsibleFk',
							name: 'Responsible Profit Centre (Description)',
							name$tr$: 'businesspartner.main.companyResponsibleCompanyName',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'CompanyName'
							},
							width: 250
						},
						{
							afterId: 'basclerkfk',
							id: 'ClerkResponsibleDescription',
							field: 'BasClerkFk',
							name: 'Clerk Description',
							name$tr$: 'cloud.common.entityResponsibleDescription',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'clerk',
								displayMember: 'Description'
							},
							width: 250
						}
					]
				}
			};
		}]);

	// Contact
	angular.module(moduleName).factory('businessPartnerMainContactLayout',
		['basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter', 'basicsLookupdataConfigGeneratorExtension', 'basicsCommonCommunicationFormatter',
			function (basicsLookupdataConfigGenerator, complexFormatter, basicsLookupdataConfigGeneratorExtension, communicationFormatter) {
				return {
					'fid': 'businesspartner.main.contact.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['contactrolefk', 'titlefk', 'title', 'firstname', 'initials', 'familyname', 'pronunciation', 'companyfk', 'islive','isdefaultbaseline']
						},
						{
							'gid': 'communication',
							'attributes': ['telephonenumberdescriptor', 'telephonenumber2descriptor', 'telefaxdescriptor', 'mobiledescriptor', 'internet', 'email', 'baslanguagefk', 'emailprivate']
						},
						{
							'gid': 'addresses',
							'attributes': ['countryfk', 'subsidiaryfk', 'addressdescriptor', 'privatetelephonenumberdescriptor']
						},
						{
							'gid': 'marketing',
							'attributes': ['clerkresponsiblefk', 'contacttimelinessfk', 'contactoriginfk', 'contactabcfk']
						},
						{
							'gid': 'other',
							'attributes': ['birthdate', 'nickname', 'partnername', 'children', 'remark', 'isdefault']
						},
						{
							'gid': 'itwoPortal',
							'attributes': ['provider', 'providerid', 'providerfamilyname', 'provideremail', 'provideraddress',
								'providercomment', 'portalusergroupname', 'logonname', 'identityprovidername', 'lastlogin', 'statement', 'setinactivedate']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName, 'businesspartner.contact', 'basics.customize'],
						'extraWords': {
							communication: {
								location: moduleName,
								identifier: 'groupCommunication',
								initial: 'Communication'
							},
							addresses: {location: moduleName, identifier: 'groupAddresses', initial: 'Addresses'},
							marketing: {location: moduleName, identifier: 'groupMarketing', initial: 'Marketing'},
							other: {location: moduleName, identifier: 'groupOther', initial: 'Other'},
							itwoPortal: {location: moduleName, identifier: 'groupITwoPortal', initial: 'iTWO Portal'},
							ContactRoleFk: {location: moduleName, identifier: 'role', initial: 'Role'},
							Title: {location: 'businesspartner.contact', identifier: 'titleName', initial: 'Title'},
							FirstName: {location: moduleName, identifier: 'firstName', initial: 'First Name'},
							Initials: {location: moduleName, identifier: 'initials', initial: 'Initials'},
							FamilyName: {location: moduleName, identifier: 'familyName', initial: 'Last Name'},
							Pronunciation: {location: moduleName, identifier: 'pronunciation', initial: 'Pronunciation'},
							CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
							BasLanguageFk: {location: 'basics.customize', identifier: 'language', initial: 'Language'},
							TelephoneNumberDescriptor: {
								location: moduleName,
								identifier: 'telephoneNumber',
								initial: 'Telephone'
							},
							TelephoneNumber2Descriptor: {
								location: moduleName,
								identifier: 'telephoneNumber2',
								initial: 'Other Tel.'
							},
							TeleFaxDescriptor: {location: moduleName, identifier: 'telephoneFax', initial: 'Telefax'},
							MobileDescriptor: {location: moduleName, identifier: 'mobileNumber', initial: 'Mobile'},
							Internet: {location: moduleName, identifier: 'internet', initial: 'Internet'},
							Email: {location: moduleName, identifier: 'email', initial: 'E-mail'},
							CountryFk: {location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country'},
							SubsidiaryFk: {location: moduleName, identifier: 'subsidiaryAddress', initial: 'Subsidiary'},
							AddressDescriptor: {
								location: moduleName,
								identifier: 'contactAddress',
								initial: 'Private address'
							},
							PrivateTelephoneNumberDescriptor: {
								location: moduleName,
								identifier: 'contactTelephoneNumber',
								initial: 'Private phone'
							},
							ClerkResponsibleFk: {
								location: cloudCommonModule,
								identifier: 'entityResponsible',
								initial: 'Responsible'
							},
							ContactTimelinessFk: {location: moduleName, identifier: 'timeliness', initial: 'Timeliness'},
							ContactOriginFk: {location: moduleName, identifier: 'origin', initial: 'Origin'},
							ContactAbcFk: {location: basicsCustomizeModule, identifier: 'contactabc', initial: 'Contact ABC'},
							BirthDate: {location: moduleName, identifier: 'birthDate', initial: 'Birth Date'},
							NickName: {location: moduleName, identifier: 'nickname', initial: 'Nick Name'},
							PartnerName: {location: moduleName, identifier: 'partnerName', initial: 'Partner Name'},
							Children: {location: moduleName, identifier: 'children', initial: 'Children'},
							Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
							LastLogin: {location: moduleName, identifier: 'lastLogin', initial: 'Last Logon'},
							Provider: {location: moduleName, identifier: 'provider', initial: 'Provider'},
							ProviderId: {location: moduleName, identifier: 'providerId', initial: 'Provider Id'},
							ProviderFamilyName: {location: moduleName, identifier: 'providerFamilyName', initial: 'Provider Family Name'},
							ProviderEmail: {location: moduleName, identifier: 'providerEmail', initial: 'Provider E-mail'},
							ProviderAddress: {location: moduleName, identifier: 'providerAddress', initial: 'Provider Address'},
							ProviderComment: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
							PortalUserGroupName: {location: moduleName, identifier: 'portalUserGroupName', initial: 'Portal User Group'},
							LogonName: {location: cloudCommonModule, identifier: 'User_LogonName', initial: 'Logon Name'},
							IdentityProviderName: {location: moduleName, identifier: 'identityProviderName', initial: 'Identity Provider Name'},
							Statement: {location: moduleName, identifier: 'crefodlg.gridcolstatus', initial: 'State'},
							SetInactiveDate: {location: moduleName, identifier: 'setInactiveDate', initial: 'Set Inactive Date'},
							IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
							EmailPrivate: {location: cloudCommonModule, identifier: 'emailPrivate', initial: 'Private E-Mail'},
							IsLive: {location: cloudCommonModule, identifier: 'contactIsLive', initial: 'Active'},
							IsDefaultBaseline: {location: moduleName, identifier: 'isDefaultBaseline', initial: 'Is Default Baseline'}
						}
					},
					'overloads': {
						'islive': {'readonly': true},
						'provider': {

							'grid': {
								'maxLength': 64
							},
							'detail': {
								'maxLength': 64
							},
							'readonly': true
						},
						'providerid': {
							'readonly': true
						},
						'providerfamilyname': {
							'readonly': true
						},
						'provideremail': {
							'readonly': true
						},
						'provideraddress': {
							'grid': {
								'maxLength': 320
							},
							'detail': {
								'maxLength': 320
							},
							'readonly': true
						},
						'providercomment': {
							'readonly': true
						},
						'portalusergroupname': {
							'grid': {
								'maxLength': 50
							},
							'detail': {
								'maxLength': 50
							},
							'readonly': true
						},
						'logonname': {
							'readonly': true
						},
						'identityprovidername': {
							'grid': {
								'maxLength': 50
							},
							'detail': {
								'maxLength': 50
							},
							'readonly': true
						},
						'statement': {
							'readonly': true
						},
						'setinactivedate': {
							'readonly': true
						},
						'contactrolefk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.contact.role', null, {showClearButton: true}),
						'baslanguagefk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.language', null, {showClearButton: true}),
						'titlefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-title-combobox',
									lookupOptions: {
										showClearButton: true
									}
								},
								name: 'Opening',
								name$tr$: 'businesspartner.contact.title',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'title',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 110
							},
							'detail': {
								label: 'Opening',
								label$tr$: 'businesspartner.contact.title',
								type: 'directive',
								directive: 'basics-lookupdata-title-combobox',
								options: {
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'companyfk': {
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
								'model': 'CompanyFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName'
								}
							}
						},
						'telephonenumberdescriptor': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephoneNumberFk',
										titleField: 'businesspartner.main.telephoneNumber',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								},
								width: 150
							},
							'detail': {
								'type': 'directive',
								'model': 'TelephoneNumberDescriptor',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.telephoneNumber',
									showClearButton: true
								}
							}
						},
						'telephonenumber2descriptor': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephoneNumber2Fk',
										titleField: 'businesspartner.main.telephoneNumber2',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								},
								width: 150
							},
							'detail': {
								'type': 'directive',
								'model': 'TelephoneNumber2Descriptor',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.telephoneNumber',
									showClearButton: true
								}
							}
						},
						'telefaxdescriptor': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephoneNumberTelefaxFk',
										titleField: 'businesspartner.main.telephoneFax',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								},
								width: 150
							},
							'detail': {
								'type': 'directive',
								'model': 'TeleFaxDescriptor',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.telephoneFax',
									showClearButton: true
								}
							}
						},
						'mobiledescriptor': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephoneNumberMobilFk',
										titleField: 'businesspartner.main.mobileNumber',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								},
								width: 150
							},
							'detail': {
								'type': 'directive',
								'model': 'MobileDescriptor',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.mobileNumber',
									showClearButton: true
								}
							}
						},
						'countryfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.lookup.country', null, {showClearButton: true}),
						'subsidiaryfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-subsidiary-lookup',
									lookupOptions: {
										filterKey: 'contact-subsidiary-filter',
										showClearButton: true,
										displayMember: 'DisplayText',
										disableDataCaching: true,
										inputSearchMembers: ['SubsidiaryDescription', 'Street', 'ZipCode', 'City', 'Iso2']
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'DisplayText'
								},
								width: 150
							},
							detail: {
								type: 'directive',
								model: 'SubsidiaryFk',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									showClearButton: true,
									disableDataCaching: true,
									inputSearchMembers: ['SubsidiaryDescription', 'Street', 'ZipCode', 'City', 'Iso2'],
									lookupDirective: 'business-partner-main-subsidiary-lookup',
									descriptionMember: 'AddressLine',
									lookupOptions: {
										filterKey: 'contact-subsidiary-filter',
										displayMember: 'DisplayText'
									}
								}
							}
						},
						'addressdescriptor': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-address-dialog',
									lookupOptions: {
										foreignKey: 'AddressFk',
										titleField: 'businesspartner.main.contactAddress',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'AddressLine'
								},
								width: 200
							},
							'detail': {
								'type': 'directive',
								'model': 'AddressDescriptor',
								'directive': 'basics-common-address-dialog',
								'options': {
									titleField: 'businesspartner.main.contactAddress',
									showClearButton: true
								}
							}
						},
						'privatetelephonenumberdescriptor': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-telephone-dialog',
									lookupOptions: {
										foreignKey: 'TelephonePrivatFk',
										titleField: 'businesspartner.main.contactTelephoneNumber',
										showClearButton: true
									}
								},
								formatter: complexFormatter,
								formatterOptions: {
									displayMember: 'Telephone',
									domainType: 'phone'
								},
								width: 150
							},
							'detail': {
								'type': 'directive',
								'model': 'PrivateTelephoneNumberDescriptor',
								'directive': 'basics-common-telephone-dialog',
								'options': {
									titleField: 'businesspartner.main.contactTelephoneNumber',
									showClearButton: true
								}
							}
						},
						'clerkresponsiblefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Code'
								},
								width: 150
							},
							'detail': {
								'type': 'directive',
								'model': 'ClerkResponsibleFk',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},
						'contacttimelinessfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.contact.timeliness', null, {showClearButton: true}),
						'contactoriginfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.contact.origin', null, {showClearButton: true}),
						'contactabcfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.contact.abc', null, {showIcon: true}),
						'lastlogin': {
							'readonly': true
						},
						'wrongattempts': {
							'grid': {
								width: 150
							},
							'readonly': true
						},
						'internet': {
							maxLength: 100
						},
						'email': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'basics-common-email-input',
									dataServiceName: 'businesspartnerMainContactDataService'
								},
								formatter: communicationFormatter,
								formatterOptions: {
									domainType: 'email'
								},
								width: 150,
								bulkSupport: false
							},
							'detail': {
								type: 'directive',
								directive: 'basics-common-email-input',
								dataServiceName: 'businesspartnerMainContactDataService'
							}
						},
						'emailprivate': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'basics-common-email-input',
									dataServiceName: 'businesspartnerMainContactDataService',
									field: 'EmailPrivate'
								},
								formatter: communicationFormatter,
								formatterOptions: {
									domainType: 'email'
								},
								width: 150,
								bulkSupport: false
							},
							'detail': {
								type: 'directive',
								directive: 'basics-common-email-input',
								dataServiceName: 'businesspartnerMainContactDataService',
								model: 'EmailPrivate'
							}
						},
						'firstname': {
							mandatory: true,
							navigator: {
								moduleName: 'businesspartner.contact'
							}
						},
						'familyname': {
							mandatory: true,
							navigator: {
								moduleName: 'businesspartner.contact'
							}
						}
					},
					'addition': {
						grid: [
							{
								'afterId': 'companyfk',
								id: 'CompanyName',
								field: 'CompanyFk',
								name: 'Company Name',
								name$tr$: 'cloud.common.entityCompanyName',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'CompanyName'
								},
								width: 150
							},
							{
								'afterId': 'clerkresponsiblefk',
								id: 'ClerkDescription',
								field: 'ClerkResponsibleFk',
								name: 'Requisition Name',
								name$tr$: 'cloud.common.entityResponsibleName',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Description'
								},
								width: 150
							},
							{
								afterId: 'subsidiaryfk',
								id: 'subsidiaryAdress',
								field: 'SubsidiaryFk',
								name: 'Subsidiary Address',
								name$tr$: 'businesspartner.contact.subsidiaryAddressInfo',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'AddressLine'
								},
								width: 150
							},
							{
								afterId: 'subsidiaryAdress',
								id: 'city',
								field: 'SubsidiaryFk',
								name: 'City',
								name$tr$: 'cloud.common.entityCity',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'City'
								},
								width: 150
							},
							{
								afterId: 'city',
								id: 'zipCode',
								field: 'SubsidiaryFk',
								name: 'Zip Code',
								name$tr$: 'cloud.common.entityZipCode',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'ZipCode'
								},
								width: 150
							},
							{
								afterId: 'zipCode',
								id: 'street',
								field: 'SubsidiaryFk',
								name: 'Street',
								name$tr$: 'cloud.common.entityStreet',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Subsidiary',
									displayMember: 'Street'
								},
								width: 150
							}
						],
						'detail': [
							{
								'rid': 'city',
								'afterId': 'country',
								'gid': 'addresses',
								'label': 'City',
								'label$tr$': 'cloud.common.entityCity',
								'model': 'SubsidiaryFk',
								'type': 'directive',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									displayMember: 'City'
								},
								'readonly':true
							},
							{
								'rid': 'zipCode',
								'afterId': 'city',
								'gid': 'addresses',
								'label': 'Zip Code',
								'label$tr$': 'cloud.common.entityZipCode',
								'model': 'SubsidiaryFk',
								'type': 'directive',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									displayMember: 'ZipCode'
								},
								'readonly':true
							},
							{
								'rid': 'street',
								'afterId': 'zipCode',
								'gid': 'addresses',
								'label': 'Street',
								'label$tr$': 'cloud.common.entityStreet',
								'model': 'SubsidiaryFk',
								'type': 'directive',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									displayMember: 'Street'
								},
								'readonly':true
							}
						]
					}
				};
			}]);

	// Customer
	angular.module(moduleName).factory('businesspartnerMainCustomerLayout',
		['basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'basicsCommonComplexFormatter',
			function (basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension) {
				return {
					'fid': 'businesspartner.main.customer.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['customerstatusfk', 'buyerreference', 'code', 'customerledgergroupfk', 'supplierno', 'subsidiaryfk', 'customerbranchfk',
								'businessunitfk', 'paymenttermfifk', 'paymenttermpafk', 'subledgercontextfk',
								'businesspostinggroupfk', 'vatgroupfk', 'baspaymentmethodfk', 'bpddunninggroupfk', 'blockingreasonfk', 'description', 'description2', 'einvoice','creditlimit',
								'customerledgergroupicfk','rubriccategoryfk']
						},
						{
							'gid': 'userDefined',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							BuyerReference: {
								location: moduleName,
								identifier: 'entityBuyerReference',
								initial: 'Buyer Reference'
							},
							CustomerStatusFk: {
								location: cloudCommonModule,
								identifier: 'entityStatus',
								initial: 'Status'
							},
							DebtorCode: {
								location: moduleName,
								identifier: 'entityDebtorCode',
								initial: 'Debtor Code'
							},
							PaymentTermFiFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermFI',
								initial: 'Payment Term (FI)'
							},
							SubsidiaryFk: {
								location: cloudCommonModule,
								identifier: 'entitySubsidiary',
								initial: 'Subsidiary'
							},
							PaymentTermPaFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermPA',
								initial: 'Payment Term (PA)'
							},
							CustomerLedgerGroupFk: {
								location: moduleName,
								identifier: 'ledgerGroup',
								initial: 'Ledger Group'
							},
							SupplierNo: {location: moduleName, identifier: 'supplierNo', initial: 'Supplier No'},
							BusinessUnitFk: {
								location: moduleName,
								identifier: 'businessUnit',
								initial: 'Business Unit'
							},
							SubledgerContextFk: {
								location: moduleName,
								identifier: 'entitySubledgerContext',
								initial: 'Subledger Context'
							},
							VatGroupFk: {
								location: moduleName,
								identifier: 'vatGroup',
								initial: 'Vat Group'
							},
							BusinessPostingGroupFk: {
								location: moduleName,
								identifier: 'businessPostingGroup',
								initial: 'Business Posting Group'
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
							UserDefined4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 4',
								param: {'p_0': '4'}
							},
							UserDefined5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 5',
								param: {'p_0': '5'}
							},
							BasPaymentMethodFk: {
								location: cloudCommonModule,
								identifier: 'entityBasPaymentMethod',
								initial: 'Payment Method'
							},
							BpdDunninggroupFk: {
								location: basicsCustomizeModule,
								identifier: 'dunninggroup',
								initial: 'Dunning Group'
							}, Description: {
								location: cloudCommonModule,
								identifier: 'entityDescription',
								initial: 'Description'
							}, Description2: {
								location: cloudCommonModule,
								identifier: 'entityDescription2',
								initial: 'Description2'
							},
							BlockingReasonFk: {
								location: moduleName,
								identifier: 'blockingReason',
								initial: 'Blocking Reason'
							},
							Einvoice: {
								location: moduleName,
								identifier: 'entityEinvoice',
								initial: 'E-Invoice'
							},
							CreditLimit: {
								location: moduleName,
								identifier: 'creditLimit',
								initial: 'Credit Limit'
							},
							CustomerLedgerGroupIcFk: {
								location: moduleName,
								identifier: 'ledgerGroupIcRecharging',
								initial: 'Ledger Group IC Recharging'
							}
						},
						RubricCategoryFk:{
							location: cloudCommonModule,
							identifier: 'entityBasRubricCategoryFk',
							initial: 'Rubric Category'
						}
					},
					'overloads': {
						'code': {
							'grid': {
								'name$tr$': 'businesspartner.main.entityDebtorCode',
								maxLength: 42
							},
							'detail': {
								'label': 'Debtor Code',
								'label$tr$': 'businesspartner.main.entityDebtorCode',
								maxLength: 42
							}
						},
						'customerstatusfk': {
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CustomerStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								},
								'name$tr$': 'cloud.common.entityStatus',
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-customer-status-combobox',
								'options': {
									readOnly: true,
									imageSelector: 'platformStatusIconService'
								},
								'label': 'Status',
								'label$tr$': 'cloud.common.entityStatus',
							},
							readonly: true
						},
						'subsidiaryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
							additionalColumns: false,
							enableCache: true,
							filter: function (item) {
								if (item) {
									return (item && item.BusinessPartnerFk) ? (item.BusinessPartnerFk) : -1;
								}
								return 0;
							}
						}),
						'paymenttermpafk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'paymenttermfifk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'customerledgergroupfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-customer-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-customer-customerledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CustomerLedgerGroup',
									displayMember: 'DescriptionInfo.Translated'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-customer-ledger-group-combobox',
								'options': {
									descriptionMember: 'DescriptionInfo.Translated',
									filterKey: 'business-partner-main-customer-customerledgergroup-filter'
								}
							}
						},
						'businessunitfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-Business-unit-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'businessunit',
									displayMember: 'Description'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-Business-unit-combobox',
								'model': 'BusinessUnitFk',
								'options': {
									descriptionMember: 'Description'
								}
							}
						},
						'customerbranchfk': {
							'grid': {
								'name$tr$': 'businesspartner.main.customerBranchCode',
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-customer-branch-lookup',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'customerbranch',
									displayMember: 'Code'
								},
								width: 140
							},
							'detail': {
								'label': 'Branch',
								'label$tr$': 'businesspartner.main.customerBranch',
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'model': 'CustomerBranchFk',
								'options': {
									lookupDirective: 'business-partner-main-customer-branch-lookup',
									descriptionMember: 'Description',
									lookupOptions: {showClearButton: true}
								}
							}
						},
						'subledgercontextfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.company.subledgercontext'),
						'vatgroupfk': {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'VatGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								'editor': 'lookup',
								'editorOptions': {
									directive: 'business-partner-vat-group-lookup',
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-vat-group-lookup',
								'options': {
									showClearButton: true,
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'blockingreasonfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.blockingreason'),
						'businesspostinggroupfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-business-posting-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-customer-businesspostinggroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'DescriptionInfo.Translated',
									lookupType: 'BusinessPostingGroup'
								}
							},
							detail: {
								type: 'directive',
								directive: 'business-partner-business-posting-group-combobox',
								options: {
									filterKey: 'business-partner-main-customer-businesspostinggroup-filter'
								}
							}
						},
						baspaymentmethodfk: basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.paymentmethod', null, {showClearButton: true}),
						bpddunninggroupfk: basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.dunninggroup', null),
						'customerledgergroupicfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-customer-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-customer-customerledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CustomerLedgerGroup',
									displayMember: 'DescriptionInfo.Translated'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-customer-ledger-group-combobox',
								'options': {
									descriptionMember: 'DescriptionInfo.Translated',
									filterKey: 'business-partner-main-customer-customerledgergroup-filter'
								}
							}
						},
						'rubriccategoryfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									lookupOptions: {
										filterKey: 'customer-rubric-category-lookup-filter',
										showClearButton: true,
										disableDataCaching: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									'lookupType': 'RubricCategoryByRubricAndCompany',
									'displayMember': 'Description'
								},
								width: 125,
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: 'customer-rubric-category-lookup-filter',
										showClearButton: true,
										disableDataCaching: true
									}
								}
							}
						},
					},
					'addition': {
						'grid': [
							{
								'afterId': 'customerbranchfk',
								id: 'customerBranchDesc',
								field: 'CustomerBranchFk',
								name$tr$: 'businesspartner.main.branchDescription',
								sortable: true,
								width: 140,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CustomerBranch',
									displayMember: 'Description'
								}
							},
							{
								'lookupDisplayColumn': true,
								'field': 'PaymentTermFiFk',
								'displayMember': 'Description',
								'name$tr$': 'cloud.common.entityPaymentTermFiDescription',
								'width': 180
							}, {
								'lookupDisplayColumn': true,
								'field': 'PaymentTermPaFk',
								'displayMember': 'Description',
								'name$tr$': 'cloud.common.entityPaymentTermPaDescription',
								'width': 180
							}
						]
					}
				};
			}
		]);

	// Procurement Structure
	angular.module(moduleName).factory('businesspartnerMainProcurementStructureLayout', ['basicsCommonComplexFormatter', 'basicsCommonComplexFormatterHtmlOptional','basicsLookupdataConfigGenerator',
		/* jshint -W098 */  //
		function (basicsCommonComplexFormatter, basicsCommonComplexFormatterHtmlOptional,basicsLookupdataConfigGenerator) {
			return {
				'fid': 'businesspartner.main.procurementStructure.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['bpdsubsidiaryfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						BpdSubsidiaryFk: {
							location: cloudCommonModule,
							identifier: 'entitySubsidiary',
							initial: 'Subsidiary'
						},
					}
				},
				'addition': {
					'grid': [
						{
							'beforeId': 'Description',
							id: 'Code',
							rid: 'Code',
							field: 'PrcStructure',
							name: 'Code',
							name$tr$: 'businesspartner.main.code',
							sortable: true,
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Code'
							},
							width: 150
						},
						{
							'afterId': 'Code',
							id: 'Description',
							rid: 'Description',
							field: 'PrcStructure',
							name: 'Description',
							name$tr$: 'businesspartner.main.description',
							sortable: true,
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Description'
							},
							width: 150
						},
						{
							afterId: 'Description',
							id: 'CommentText',
							rid: 'CommentText',
							field: 'PrcStructure',
							name: 'Comment',
							name$tr$: 'cloud.common.entityCommentText',
							sortable: true,
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Comment'
							},
							width: 180
						},
						{
							afterId: 'CommentText',
							id: 'IsLive',
							rid: 'IsLive',
							field: 'PrcStructure',
							name: 'Active',
							name$tr$: 'cloud.common.entityIsLive',
							sortable: true,
							formatter: basicsCommonComplexFormatterHtmlOptional,
							formatterOptions: {
								domainType: 'boolean',
								displayMember: 'IsLive'
							},
							cssClass: 'text-center',
							width: 80
						},
						{
							afterId: 'IsLive',
							id: 'AllowAssignment',
							rid: 'AllowAssignment',
							field: 'PrcStructure',
							name: 'Allow Assignment',
							name$tr$: 'basics.procurementstructure.allowAssignment',
							sortable: true,
							formatter: basicsCommonComplexFormatterHtmlOptional,
							formatterOptions: {
								domainType: 'boolean',
								displayMember: 'AllowAssignment'
							},
							cssClass: 'text-center',
							width: 100
						}
					]
				},
				'overloads': {
					'bpdsubsidiaryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
						additionalColumns: false,
						enableCache: true,
						readonly:true,
						filter: function (item) {
							if (item) {
								return (item && item.BusinessPartnerFk) ? (item.BusinessPartnerFk) : -1;
							}
							return 0;
						}
					}),
				}
			};
		}]);
	angular.module(moduleName).factory('businessPartnerMainExtRoleLayout',
		['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'businesspartner.main.externalrole.list',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['externalrolefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						ExternalRoleFk: {location: moduleName, identifier: 'ExternalRoleFk', initial: 'External Role'}
					}
				},
				'overloads': {
					'externalrolefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.main.extrole')
				}
			};
		}]);

	// Realestate
	angular.module(moduleName).factory('businesspartnerMainRealestateLayout', ['basicsCommonComplexFormatter', 'basicsLookupdataConfigGenerator',
		function (complexFormatter, basicsLookupdataConfigGenerator) {
			return {
				'fid': 'businesspartner.main.realestate.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['realestatetypefk', 'objectname', 'address', 'subsidiaryfk', 'remark', 'potential', 'lastaction',
							'telephonenumber', 'telephonenumbertelefax']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						RealestateTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						ObjectName: {location: moduleName, identifier: 'objectName', initial: 'Object Name'},
						Address: {location: cloudCommonModule, identifier: 'entityAddress', initial: 'Address'},
						SubsidiaryFk: {
							location: cloudCommonModule,
							identifier: 'entitySubsidiary',
							initial: 'Subsidiary'
						},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
						Potential: {location: moduleName, identifier: 'potential', initial: 'Potential'},
						LastAction: {location: moduleName, identifier: 'lastAction', initial: 'LastAction'},
						TelephoneNumber: {
							location: moduleName,
							identifier: 'telephoneNumber',
							initial: 'Telephone Number'
						},
						TelephoneNumberTeleFax: {location: moduleName, identifier: 'telephoneFax', initial: 'Fax'}
					}
				},
				'overloads': {
					'realestatetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.real.estate.type'),
					'address': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'basics-common-address-dialog',
								lookupOptions: {
									foreignKey: 'AddressFk',
									titleField: 'cloud.common.entityAddress',
									showClearButton: true
								}
							},
							width: 120,
							'formatter': complexFormatter,
							'formatterOptions': {
								displayMember: 'AddressLine'
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'Address',
							'directive': 'basics-common-address-dialog',
							'options': {}
						}
					},
					'subsidiaryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
						additionalColumns: false,
						enableCache: true,
						filter: function (item) {
							if (item) {
								return (item && item.BusinessPartnerFk) ? (item.BusinessPartnerFk) : -1;
							}
							return 0;
						}
					}),
					'telephonenumber': {
						'grid': {
							width: 120,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberFk',
									titleField: 'businesspartner.main.telephoneNumber',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						},
						'detail': {
							'model': 'TelephoneNumber',
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'options': {}
						}
					},
					'telephonenumbertelefax': {
						'grid': {
							width: 80,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberTelefaxFk',
									titleField: 'businesspartner.main.telephoneFax',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						},
						'detail': {
							'model': 'TelephoneNumberTeleFax',
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'options': {}
						}
					}
				}
			};
		}]);

	// Subsidiary
	angular.module(moduleName).factory('businessPartnerMainSubsidiaryLayout', ['$injector', 'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter',
		function ($injector, complexFormatter, communicationFormatter) {
			return {
				'fid': 'businesspartner.main.contact.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['ismainaddress', 'description', 'bedirektno', 'vatno', 'taxno', 'traderegister', 'traderegisterno', 'traderegisterdate', 'innno', 'remark', 'subsidiarystatusfk']
					},
					{
						'gid': 'addresses',
						'attributes': ['addresstypefk', 'addressdto', 'telephonenumber1dto', 'telephonenumber2dto', 'telephonenumbertelefaxdto', 'telephonenumbermobiledto', 'email']
					},
					{
						'gid': 'userDefined',
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						addresses: {location: moduleName, identifier: 'groupAddresses', initial: 'Address'},
						userDefined: {
							location: moduleName,
							identifier: 'groupUserDefined',
							initial: 'User Defined Texts'
						},
						IsMainAddress: {location: moduleName, identifier: 'isMainAddress', initial: 'Is Main Address'},
						Description: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
						BedirektNo: {location: moduleName, identifier: 'beDirectNo', initial: 'BeDirect No.'},
						Innno: {location: moduleName, identifier: 'InnNo', initial: 'INN No.'},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
						AddressTypeFk: {location: moduleName, identifier: 'addressType', initial: 'Address Type'},
						AddressDto: {location: cloudCommonModule, identifier: 'entityAddress', initial: 'Street'},
						TelephoneNumber1Dto: {
							location: moduleName,
							identifier: 'telephoneNumber',
							initial: 'Telephone'
						},
						TelephoneNumber2Dto: {
							location: moduleName,
							identifier: 'telephoneNumber2',
							initial: 'Other Tel.'
						},
						TelephoneNumberTelefaxDto: {
							location: moduleName,
							identifier: 'telephoneFax',
							initial: 'Telefax'
						},
						TelephoneNumberMobileDto: {location: moduleName, identifier: 'mobileNumber', initial: 'Mobile'},
						Email: {location: moduleName, identifier: 'email', initial: 'E-mail'},
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
						UserDefined4: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 4',
							param: {'p_0': '4'}
						},
						UserDefined5: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 5',
							param: {'p_0': '5'}
						},
						SubsidiaryStatusFk: {
							location: cloudCommonModule,
							identifier: 'subsidiaryStatus',
							initial: 'Subsidiary Status'

						}
					}
				},
				'overloads': {
					'ismainaddress':
						{
							'grid': {
								considerReadonly: true,
								bulkSupport: false
							},
							'detail': {
								considerReadonly: true
							}
						},
					'subsidiarystatusfk': {
						'grid': {

							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SubsidiaryStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-subsidiary-status-combobox',
							'options': {
								readOnly: true,
								imageSelector: 'platformStatusIconService'
							}
						},
						readonly: true
					},
					'addresstypefk': {
						'grid': {
							editor: 'lookup',
							enableCache: true,
							editorOptions: {
								directive: 'basics-lookupdata-address-type-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'AddressType',
								displayMember: 'Description'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-address-type-combobox'
						}
					},
					'addressdto': {
						'grid': {
							width: 120,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								lookupOptions: {
									foreignKey: 'AddressFk',
									titleField: 'cloud.common.entityAddress',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'AddressLine'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-address-dialog',
							'options': {
								foreignKey: 'AddressFk',
								titleField: 'cloud.common.entityAddress',
								showClearButton: true
							}
						}
					},
					'telephonenumber1dto': {
						'grid': {
							width: 120,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumber1Fk',
									titleField: 'businesspartner.main.telephoneNumber',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'options': {
								titleField: 'businesspartner.main.telephoneNumber',
								showClearButton: true
							}
						}
					},
					'telephonenumber2dto': {
						'grid': {
							width: 120,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumber2Fk',
									titleField: 'businesspartner.main.telephoneNumber2',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'options': {
								titleField: 'businesspartner.main.telephoneNumber2',
								showClearButton: true
							}
						}
					},
					'telephonenumbertelefaxdto': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberTelefaxFk',
									titleField: 'businesspartner.main.telephoneFax',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'options': {
								titleField: 'businesspartner.main.telephoneFax',
								showClearButton: true
							}
						}
					},
					'telephonenumbermobiledto': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-telephone-dialog',
								lookupOptions: {
									foreignKey: 'TelephoneNumberMobileFk',
									titleField: 'businesspartner.main.mobileNumber',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'options': {
								titleField: 'businesspartner.main.mobileNumber',
								showClearButton: true
							}
						}
					},
					'email': {
						'grid': {
							editor: 'directive',
							editorOptions: {
								directive: 'basics-common-email-input',
								dataServiceName: 'businesspartnerMainSubsidiaryDataService'
							},
							formatter: communicationFormatter,
							formatterOptions: {
								domainType: 'email'
							},
							width: 150,
							asyncValidator: function (entity, value, model) {
								return $injector.get('businesspartnerMainSubsidiaryValidationService').asyncValidateEmail(entity, value, model);
							},
							bulkSupport: false
						},
						'detail': {
							type: 'directive',
							directive: 'basics-common-email-input',
							dataServiceName: 'businesspartnerMainSubsidiaryDataService',
							asyncValidator: function (entity, value, model) {
								return $injector.get('businesspartnerMainSubsidiaryValidationService').asyncValidateEmail(entity, value, model);
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'addressdto',
							id: 'street',
							field: 'AddressDto.Street',
							name$tr$: 'cloud.common.entityStreet',
							sortable: true,
							formatter: complexFormatter,
							width: 120
						},
						{
							'afterId': 'street',
							id: 'city',
							field: 'AddressDto.City',
							name$tr$: 'cloud.common.entityCity',
							sortable: true,
							formatter: complexFormatter,
							width: 120
						},
						{
							'afterId': 'city',
							id: 'zipCode',
							field: 'AddressDto.ZipCode',
							name$tr$: 'cloud.common.entityZipCode',
							sortable: true,
							formatter: complexFormatter,
							width: 80
						},
						{
							'afterId': 'zipCode',
							'id': 'country',
							field: 'AddressDto.CountryISO2',
							'name': 'Country',
							'name$tr$': 'cloud.common.entityCountry',
							sortable: true,
							formatter: complexFormatter
						},
						{
							'afterId': 'country',
							'id': 'countryDesc',
							field: 'AddressDto.CountryDescription',
							'name': 'Country Description',
							'name$tr$': 'basics.common.entityCountryDescription',
							sortable: true,
							formatter: complexFormatter
						},
						{
							'afterId': 'countryDesc',
							'id': 'addressSupplement',
							field: 'AddressDto.Supplement',
							'name': 'Address Supplement',
							'name$tr$': 'cloud.common.entityAddressSupplement',
							sortable: true,
							formatter: complexFormatter,
							width: 200
						}
					],
					'detail': [
						{
							'afterId': 'addressdto',
							'rid': 'street',
							'gid': 'addresses',
							'id': 'street',
							'label': 'Street',
							'label$tr$': 'cloud.common.entityStreet',
							'type': 'comment',
							'model': 'AddressDto.Street',
							'readonly': true
						},
						{
							'afterId': 'street',
							'rid': 'city',
							'gid': 'addresses',
							'id': 'city',
							'label': 'City',
							'label$tr$': 'cloud.common.entityCity',
							'type': 'description',
							'model': 'AddressDto.City',
							'readonly': true
						},
						{
							'afterId': 'city',
							'rid': 'zipCode',
							'gid': 'addresses',
							'id': 'zipCode',
							'label': 'Zip Code',
							'label$tr$': 'cloud.common.entityZipCode',
							'type': 'description',
							'model': 'AddressDto.ZipCode',
							'readonly': true
						},
						{
							'afterId': 'zipCode',
							'rid': 'country',
							'gid': 'addresses',
							'type': 'description',
							'model': 'AddressDto.CountryISO2',
							'label': 'Country',
							'label$tr$': 'cloud.common.entityCountry',
							'readonly': true
						},
						{
							'afterId': 'country',
							'rid': 'countryDesc',
							'gid': 'addresses',
							'type': 'description',
							'model': 'AddressDto.CountryDescription',
							'label': 'Country Description',
							'label$tr$': 'basics.common.entityCountryDescription',
							'readonly': true
						},
						{
							'afterId': 'countryDesc',
							'rid': 'addressSupplement',
							'gid': 'addresses',
							'type': 'comment',
							'model': 'AddressDto.Supplement',
							'label': 'Address Supplement',
							'label$tr$': 'cloud.common.entityAddressSupplement',
							'readonly': true
						}
					]
				}
			};
		}]);

	// Region
	angular.module(moduleName).factory('businessPartnerMainRegionLayout', ['$injector','basicsCommonComplexFormatter',
		function ($injector, complexFormatter ) {
			let ZipCode;
			return {
				'fid': 'businesspartner.main.region.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['isactive', 'code','description']
					},
					{
						'gid': 'addresses',
						'attributes': ['addressdto']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						isactive:{location: moduleName, identifier: 'isActive', initial: 'Is Active'},
						addresses: {location: moduleName, identifier: 'groupAddresses', initial: 'Address'},
						Description: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
						AddressDto: {location: cloudCommonModule, identifier: 'entityAddress', initial: 'Address'},
					}
				},
				'overloads': {
					'addressdto': {
						'grid': {
							width: 120,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								lookupOptions: {
									foreignKey: 'AddressFk',
									titleField: 'cloud.common.entityAddress',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'AddressLine'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-address-dialog',
							'options': {
								foreignKey: 'AddressFk',
								titleField: 'cloud.common.entityAddress'
							}
						}
					},
				},
				'addition': {
					grid: [
						{
							'afterId': 'addressdto',
							id: 'country',
							field: 'AddressDto.CountryISO2',
							name: 'Country',
							name$tr$: 'cloud.common.entityCountry',
							sortable: true,
							formatter: complexFormatter
						},
						{
							'afterId': 'country',
							id: 'countryDesc',
							field: 'AddressDto.CountryDescription',
							name: 'Country Description',
							name$tr$: 'basics.common.entityCountryDescription',
							sortable: true,
							formatter: complexFormatter
						},
						{
							'afterId': 'countryDesc',
							id: 'city',
							field: 'AddressDto.City',
							name$tr$: 'cloud.common.entityCity',
							sortable: true,
							formatter: complexFormatter,
							width: 120
						},
						{
							'afterId': 'city',
							id: 'street',
							field: 'AddressDto.Street',
							name$tr$: 'cloud.common.entityStreet',
							sortable: true,
							formatter: complexFormatter,
							width: 120
						},
						{
							'afterId': 'street',
							id: 'zipCode',
							field: 'AddressDto.ZipCode',
							name$tr$: 'cloud.common.entityZipCode',
							sortable: true,
							formatter: complexFormatter,
							width: 80
						},
					],
					detail: [
						{
							'afterId': 'addressdto',
							'rid': 'country',
							'gid': 'addresses',
							'type': 'description',
							'model': 'AddressDto.CountryISO2',
							'label': 'Country',
							'label$tr$': 'cloud.common.entityCountry',
							'readonly': true
						},
						{
							'afterId': 'country',
							'rid': 'countryDesc',
							'gid': 'addresses',
							'type': 'description',
							'model': 'AddressDto.CountryDescription',
							'label': 'Country Description',
							'label$tr$': 'basics.common.entityCountryDescription',
							'readonly': true
						},
						{
							'afterId': 'countryDesc',
							'rid': 'city',
							'gid': 'addresses',
							'id': 'city',
							'label': 'City',
							'label$tr$': 'cloud.common.entityCity',
							'type': 'description',
							'model': 'AddressDto.City',
							'readonly': true
						},
						{
							'afterId': 'city',
							'rid': 'street',
							'gid': 'addresses',
							'id': 'street',
							'label': 'Street',
							'label$tr$': 'cloud.common.entityStreet',
							'type': 'comment',
							'model': 'AddressDto.Street',
							'readonly': true
						},
						{
							'afterId': 'street',
							'rid': 'zipCode',
							'gid': 'addresses',
							'id': 'zipCode',
							'label': 'Zip Code',
							'label$tr$': 'cloud.common.entityZipCode',
							'type': 'description',
							'model': 'AddressDto.ZipCode',
							'readonly': true
						}
					]
				}
			};
		}]);

	// Supplier
	angular.module(moduleName).factory('businesspartnerMainSupplierLayout',
		['basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension',
			function (basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension) {

				return {
					'fid': 'businesspartner.main.supplier.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['supplierstatusfk', 'supplierledgergroupfk', 'code', 'description', 'description2', 'customerno', 'paymenttermpafk', 'paymenttermfifk',
								'subledgercontextfk', 'vatgroupfk', 'subsidiaryfk', 'businesspostinggroupfk', 'bankfk', 'baspaymentmethodfk', 'businesspostgrpwhtfk', 'blockingreasonfk',
								'supplierledgergroupicfk','rubriccategoryfk']
						},
						{
							'gid': 'userDefined',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName, billingSchemaModule, cloudCommonModule],
						'extraWords': {
							SupplierStatusFk: {
								location: moduleName,
								identifier: 'supplierStatus',
								initial: 'Supplier-Status'
							},
							SupplierLedgerGroupFk: {
								location: moduleName,
								identifier: 'ledgerGroup',
								initial: 'Ledger Group'
							},
							CreditorCode: {
								location: moduleName,
								identifier: 'entityCreditorCode',
								initial: 'Creditor Code'
							},
							Description: {
								location: cloudCommonModule,
								identifier: 'entityDescription',
								initial: 'Description'
							},
							'Description2': {
								'location': billingSchemaModule,
								'identifier': 'entityDescription2',
								'initial': 'Description 2'
							},
							CustomerNo: {location: moduleName, identifier: 'customerNo', initial: 'Customer No.'},
							PaymentTermPaFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermPA',
								initial: 'Payment Term (PA)'
							},
							PaymentTermFiFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermFI',
								initial: 'Payment Term (PI)'
							},
							SubledgerContextFk: {
								location: moduleName,
								identifier: 'entitySubledgerContext',
								initial: 'Subledger Context'
							},
							VatGroupFk: {
								location: moduleName,
								identifier: 'vatGroup',
								initial: 'Vat Group'
							},
							SubsidiaryFk: {
								location: cloudCommonModule,
								identifier: 'entitySubsidiary',
								initial: 'Subsidiary'
							},
							BusinessPostingGroupFk: {
								location: moduleName,
								identifier: 'businessPostingGroup',
								initial: 'Business Posting Group'
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
							UserDefined4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 4',
								param: {'p_0': '4'}
							},
							UserDefined5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 5',
								param: {'p_0': '5'}
							},
							BankFk: {
								location: cloudCommonModule,
								identifier: 'entityBankName',
								initial: 'Bank'
							},
							BasPaymentMethodFk: { // todo livia
								location: cloudCommonModule,
								identifier: 'entityBasPaymentMethod',
								initial: 'Payment Method'
							},
							BusinessPostGrpWhtFk: {
								location: cloudCommonModule,
								identifier: 'entityBusinessPostGrpWht',
								initial: 'Posting Group Withholding Tax'
							},
							BlockingReasonFk: {
								location: moduleName,
								identifier: 'blockingReason',
								initial: 'Blocking Reason'
							},
							SupplierLedgerGroupIcFk: {
								location: moduleName,
								identifier: 'ledgerGroupIcRecharging',
								initial: 'Ledger Group IC Recharging'
							},
							RubricCategoryFk:{
								location: cloudCommonModule,
								identifier: 'entityBasRubricCategoryFk',
								initial: 'Rubric Category'
							}
						}
					},
					'overloads': {
						'code': {
							'grid': {
								'name$tr$': 'businesspartner.main.entityCreditorCode',
								maxLength: 42
							},
							'detail': {
								'label': 'Creditor Code',
								'label$tr$': 'businesspartner.main.entityCreditorCode',
								maxLength: 42
							}
						},
						'supplierstatusfk': {
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SupplierStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-supplier-status-combobox',
								'options': {
									readOnly: true,
									imageSelector: 'platformStatusIconService'
								}
							},
							readonly: true
						},
						'subsidiaryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
							// additionalColumns: false,
							// enableCache: true,
							filter: function (item) {
								if (item) {
									return (item && item.BusinessPartnerFk) ? (item.BusinessPartnerFk) : -1;
								}
								return 0;
							}
						}),
						'supplierledgergroupfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-supplier-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-supplier-supplierledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SupplierLedgerGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 125
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-supplier-ledger-group-combobox',
								'options': {
									showClearButton: false,
									descriptionMember: 'DescriptionInfo.Translated',
									filterKey: 'business-partner-main-supplier-supplierledgergroup-filter'
								}
							}
						},
						'paymenttermpafk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'paymenttermfifk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'subledgercontextfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.company.subledgercontext'),
						'vatgroupfk': {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'VatGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								'editor': 'lookup',
								'editorOptions': {
									directive: 'business-partner-vat-group-lookup',
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-vat-group-lookup',
								'options': {
									showClearButton: true,
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'blockingreasonfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.blockingreason'),
						'businesspostinggroupfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-business-posting-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-supplier-businesspostinggroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'DescriptionInfo.Translated',
									lookupType: 'BusinessPostingGroup'
								}
							},
							detail: {
								type: 'directive',
								directive: 'business-partner-business-posting-group-combobox',
								options: {
									filterKey: 'business-partner-main-supplier-businesspostinggroup-filter'
								}
							}
						},
						'bankfk': {
							// grid:supplierBankFkConfig.grid,
							// detail: supplierBankFkConfig.detail,
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'business-partner-main-bank-filter',
										disableInput: true,
										displayMember: 'BankIbanWithName'
									},
									directive: 'business-partner-bank-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'businesspartner.main.bank',
									displayMember: 'BankIbanWithName'
								}
							},
							detail: {
								type: 'directive',
								directive: 'business-Partner-Bank-Combobox',
								options: {
									displayMember: 'BankIbanWithName',
									disableInput: true,
									filterKey: 'business-partner-main-bank-filter'
								}
							},

							readonly: false
						},
						baspaymentmethodfk: basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.paymentmethod', null, {showClearButton: true}),
						businesspostgrpwhtfk: basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.postinggroupwithholdingtax', null, {showClearButton: true}),
						'supplierledgergroupicfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-supplier-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-supplier-supplierledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SupplierLedgerGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 125
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-supplier-ledger-group-combobox',
								'options': {
									showClearButton: false,
									descriptionMember: 'DescriptionInfo.Translated',
									filterKey: 'business-partner-main-supplier-supplierledgergroup-filter'
								}
							}
						},
						'rubriccategoryfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									lookupOptions: {
										filterKey: 'supplier-rubric-category-lookup-filter',
										showClearButton: true,
										disableDataCaching: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									'lookupType': 'RubricCategoryByRubricAndCompany',
									'displayMember': 'Description'
								},
								width: 125,
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: 'supplier-rubric-category-lookup-filter',
										showClearButton: true,
										disableDataCaching: true
									}
								}
							}
						},
					},
					'addition': {
						'grid': [
							{
								'lookupDisplayColumn': true,
								'field': 'PaymentTermFiFk',
								'displayMember': 'Description',
								'name$tr$': 'cloud.common.entityPaymentTermFiDescription',
								'width': 180
							}, {
								'lookupDisplayColumn': true,
								'field': 'PaymentTermPaFk',
								'displayMember': 'Description',
								'name$tr$': 'cloud.common.entityPaymentTermPaDescription',
								'width': 180
							}
						]
					}
				};
			}
		]);

	// Screen Business Partner Evaluation
	angular.module(moduleName).factory('businessPartnerEvaluationDetailLayout',
		['basicsLookupdataConfigGenerator',
			function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'businessPartner.main.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['evalstatusfk', 'evaluationschemafk', 'evaluationdate', 'evaluationmotivefk', 'code', 'description', 'points','validfrom','validto']
						},
						{
							'gid': 'businessPartnerData',
							'attributes': ['businesspartnerfk', 'subsidiaryfk', 'contact1fk', 'contact2fk']
						},
						{
							'gid': 'responsibleData',
							'attributes': ['clerkprcfk', 'clerkreqfk', 'remark']
						},
						{
							'gid': 'references',
							'attributes': ['projectfk', 'qtnheaderfk', 'conheaderfk', 'invheaderfk']
						},
						{
							'gid': 'userDefined',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						},
						{
							'gid': 'evaluationSchema',
							'attributes': []
						},
						{
							'gid': 'evaluationItems',
							'attributes': []
						},
						{
							'gid': 'evaluationDocument',
							'attributes': []
						}
					],
					'translationInfos': {
						'extraModules': [cloudCommonModule, basicsCustomizeModule],
						'extraWords': {
							businessPartnerData: {
								location: cloudCommonModule,
								identifier: 'entityBusinessPartner',
								initial: 'Business Partner'
							},
							EvalStatusFk: {
								location: basicsCustomizeModule,
								identifier: 'evaluationstatus',
								initial: 'Evaluation Status'
							},
							responsibleData: {
								location: cloudCommonModule,
								identifier: 'entityResponsible',
								initial: 'Responsible'
							},
							EvaluationSchemaFk: {
								location: moduleName,
								identifier: 'entityEvaluationSchemaFk',
								initial: 'Evaluation Schema'
							},
							EvaluationMotiveFk: {
								location: moduleName,
								identifier: 'entityEvaluationMotiveFk',
								initial: 'Evaluation Motive'
							},
							EvaluationDate: {
								location: moduleName,
								identifier: 'entityEvaluationDate',
								initial: 'Evaluation Date'
							},
							ValidFrom: {
								location: moduleName,
								identifier: 'entityValidFrom',
								initial: 'Valid From'
							},
							ValidTo: {
								location: moduleName,
								identifier: 'entityValidTo',
								initial: 'Valid To'
							},
							Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
							Description: {
								location: cloudCommonModule,
								identifier: 'entityDescription',
								initial: 'Description'
							},
							Points: {location: moduleName, identifier: 'entityPoints', initial: 'Result'},
							BusinessPartnerFk: {
								location: cloudCommonModule,
								identifier: 'entityBusinessPartner',
								initial: 'Business Partner'
							},
							SubsidiaryFk: {
								location: cloudCommonModule,
								identifier: 'entitySubsidiary',
								initial: 'Subsidiary'
							},
							Contact1Fk: {location: moduleName, identifier: 'entityContact1', initial: 'Contact 1'},
							Contact2Fk: {location: moduleName, identifier: 'entityContact2', initial: 'Contact 2'},
							ClerkPrcFk: {
								location: moduleName,
								identifier: 'entityClerkPrc',
								initial: 'Procurement Clerk'
							},
							ClerkReqFk: {
								location: moduleName,
								identifier: 'entityClerkReq',
								initial: 'Requisition Owner'
							},
							Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'},
							ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
							ConHeaderFk: {location: moduleName, identifier: 'entityContract', initial: 'Contract'},
							InvHeaderFk: {location: moduleName, identifier: 'entityInvoice', initial: 'Invoice'},
							QtnHeaderFk: {location: moduleName, identifier: 'entityQuotation', initial: 'Quotation'},
							userDefinedFields: {
								location: cloudCommonModule,
								identifier: 'entityUserDefinedFields',
								initial: 'User Defined Fields'
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
							UserDefined4: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 4',
								param: {'p_0': '4'}
							},
							UserDefined5: {
								location: cloudCommonModule,
								identifier: 'entityUserDefined',
								initial: 'User Defined 5',
								param: {'p_0': '5'}
							},
							entityHistory: {
								location: cloudCommonModule,
								identifier: 'entityHistory',
								initial: 'History'
							},
							evaluationSchema: {
								location: moduleName,
								identifier: 'screenEvaluatoinGroupDataContainerTitle',
								initial: 'Evaluation Schema'
							},
							evaluationClerk: {
								location: moduleName,
								identifier: 'screenEvaluationClerkDataContainerTitle',
								initial: 'Evaluation Clerk'
							},
							evaluationItems: {
								location: moduleName,
								identifier: 'screenEvaluatoinItemDataContainerTitle',
								initial: 'Evaluation Items'
							},
							evaluationDocument: {
								location: moduleName,
								identifier: 'screenEvaluatoinDocumentDataContainerTitle',
								initial: 'Evaluation Document'
							},
							references: {
								location: moduleName,
								identifier: 'screenEvaluatoinReferencesGroupTitle',
								initial: 'References'
							}
						}
					},
					'overloads': {
						'evalstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.evaluationstatus', null, {showIcon: true}),
						// 'evalstatusfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.evaluationstatus', null, {showClearButton: true}),
						'points': {
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-evaluation-input-image-directive',
								'model': 'Points',
								'options': {
									displayValue: 'Points',
									displayIcon: 'IconSrc'
								}
							},
							'readonly': true
						},
						'userdefined4': {
							'readonly': true
						},
						'userdefined5': {
							'readonly': true
						},
						'evaluationschemafk': {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'EvaluationSchema',
									displayMember: 'Description'
								},
								'editor': 'lookup',
								'editorOptions': {
									directive: 'business-partner-evaluation-schema-combobox'
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-evaluation-schema-combobox',
								'model': 'EvaluationSchemaFk',
								'options': {
									displayMember: 'Description'
								}
							}
						},
						'evaluationmotivefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.evaluation.motive'),
						'businesspartnerfk': {
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
						'subsidiaryfk': {
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
										filterKey: 'businesspartner-main-evaluation-subsidiary-filter',
										showClearButton: true,
										displayMember: 'AddressLine'
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									filterKey: 'businesspartner-main-evaluation-subsidiary-filter',
									showClearButton: true,
									displayMember: 'AddressLine'
								},
								'model': 'SubsidiaryFk'
							}
						},
						'contact1fk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'business-partner-main-filtered-contact-combobox-without-teams',
									lookupOptions: {
										filterKey: 'contact1-for-evaluation-filter',
										showClearButton: true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'contact',
									displayMember: 'Code'
								},
								grouping: false
							},
							'detail': {
								'model': 'Contact1Fk',
								'type': 'directive',
								'directive': 'business-partner-main-filtered-contact-combobox-without-teams',
								'options': {
									filterKey: 'contact1-for-evaluation-filter',
									showClearButton: true
								}
							}
						},
						'contact2fk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'business-partner-main-filtered-contact-combobox-without-teams',
									lookupOptions: {
										filterKey: 'contact2-for-evaluation-filter',
										showClearButton: true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'contact',
									displayMember: 'Code'
								},
								grouping: false
							},
							'detail': {
								'model': 'Contact2Fk',
								'type': 'directive',
								'directive': 'business-partner-main-filtered-contact-combobox-without-teams',
								'options': {
									filterKey: 'contact2-for-evaluation-filter',
									showClearButton: true
								}
							}
						},
						'clerkprcfk': {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'clerk',
									displayMember: 'Code'
								},
								'editor': 'lookup',
								'editorOptions': {
									directive: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'detail': {
								'model': 'ClerkPrcFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},
						'clerkreqfk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'clerk',
									displayMember: 'Code'
								}
							},
							'detail': {
								'model': 'ClerkReqFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},
						'evaluationschemadescription': {
							'readonly': true
						},

						'projectfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookup-data-project-project-dialog',
									descriptionMember: 'ProjectName',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},
						'conheaderfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'prc-con-header-dialog',
									descriptionMember: 'Description',
									'lookupOptions': {
										filterKey: 'businesspartner-main-evaluation-conheader-filter',
										showClearButton: true
									}
								}
							}
						},
						'invheaderfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'procurement-invoice-header-dialog',
									'descriptionMember': 'Description',
									'lookupOptions': {
										filterKey: 'businesspartner-main-evaluation-invheader-filter',
										showClearButton: true
									}
								}
							}
						},
						'qtnheaderfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'procurement-quote-header-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {
										filterKey: 'businesspartner-main-evaluation-qtnheader-filter',
										showClearButton: true
									}
								}
							}
						}
					},
					'addition': {
						'grid': [
							{
								afterId: 'ClerkPrcFk',
								id: 'clerkprcdescription',
								field: 'ClerkPrcFk',
								name$tr$: 'businesspartner.main.entityClerkPrcDescription',
								sortable: true,
								width: 140,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Description'
								}
							},
							{
								afterId: 'clerkreqfk',
								id: 'clerkreqdescription',
								field: 'ClerkReqFk',
								name$tr$: 'businesspartner.main.entityClerkReqDescription',
								sortable: true,
								width: 140,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Description'
								}
							}
						]
					}
				};
			}
		]);

	// Screen Business Partner Evaluation Item Data
	angular.module(moduleName).value('businessPartnerEvaluationItemDataDetailLayout', {
		'fid': 'businessPartner.main.detailform',
		'version': '1.0.0',
		'showGrouping': true,
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['isticked', 'evaluationitemfk', 'points', 'remark']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [cloudCommonModule],
			'extraWords': {
				EvaluationItemFk: {
					location: moduleName,
					identifier: 'entityEvaluationItemDescription',
					initial: 'Item Description'
				},
				IsTicked: {location: moduleName, identifier: 'isChecked', initial: 'Checked'},
				Points: {location: moduleName, identifier: 'entityPoints', initial: 'Result'},
				Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'}
			}
		},
		'overloads': {
			'isticked': {},
			'evaluationitemfk': {
				'grid': {
					'formatter': 'lookup',
					'formatterOptions': {
						lookupType: 'EvaluationItem',
						displayMember: 'Description'
					}
				},
				'detail': {
					'type': 'directive',
					'directive': 'business-partner-evaluation-item-combobox',
					'model': 'EvaluationItemFk',
					'options': {
						displayMember: 'Description'
					}
				},
				'readonly': true
			},
			'points': {
				'readonly': true
			},
			'remark': {
				'width': 300,
				'readonly': false
			}
		}
	});

	// Screen Business Partner Evaluation Group Data
	angular.module(moduleName).factory('businessPartnerEvaluationGroupDataDetailLayout',
		['businessPartnerCustomFormatters',
			function (businessPartnerCustomFormatters) {
				return {
					'fid': 'businessPartner.main.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['isoptional', 'groupdescription', 'points', 'pointspossible', 'pointsminimum', 'weighting', 'evaluation', 'weightinggroup', 'total', 'icon', 'remark', 'formula', 'grouporder', 'commenttext', 'iconcommenttext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [cloudCommonModule, evaluationSchema],
						'extraWords': {
							GroupDescription: {
								location: moduleName,
								identifier: 'entityEvaluationGroupFk',
								initial: 'Group / Sub Group'
							},
							PointsPossible: {location: evaluationSchema, identifier: 'entityPointsPossible', initial: 'Possible Points'},
							PointsMinimum: {location: evaluationSchema, identifier: 'PointsMinimum', initial: 'Possible Minimum'},
							Weighting: {location: moduleName, identifier: 'entityWeighting', initial: 'Weighting'},
							Evaluation: {location: moduleName, identifier: 'entityEvaluation', initial: 'Evaluation'},
							WeightingGroup: {
								location: moduleName,
								identifier: 'entityEvaluationWeightingGroup',
								initial: 'Weighting.Group'
							},
							Total: {location: cloudCommonModule, identifier: 'entityTotal', initial: 'Total'},
							IsTicked: {location: moduleName, identifier: 'isChecked', initial: 'Checked'},
							Points: {location: moduleName, identifier: 'entityPoints', initial: 'Result'},
							Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'},
							CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment Text'},
							Icon: {location: cloudCommonModule, identifier: 'entityIcon', initial: 'Icon'},
							IsOptional: {location: moduleName, identifier: 'entityIsOptional', initial: 'IsOptional'},
							Formula: {location: cloudCommonModule, identifier: 'formula', initial: 'Formula'},
							GroupOrder: {location: evaluationSchema, identifier: 'groupOrder', initial: 'GroupOrder'},
							IconCommentText: {location: evaluationSchema, identifier: 'iconCommentText', initial: 'Icon Comment Text'}
						}
					},
					'overloads': {
						'isoptional': {
							'readonly': true,
							'width': 60
						},
						'groupdescription': {
							'readonly': true
						},
						'pointspossible': {
							'readonly': true
						},
						'pointsminimum': {
							'readonly': true
						},
						'weighting': {
							'grid': {
								formatter: businessPartnerCustomFormatters.percentFormatter,
								cssClass: 'text-right'
							},
							'readonly': true
						},
						'evaluation': {
							'grid': {
								formatter: businessPartnerCustomFormatters.numberForTwoDecimalPlace,
								cssClass: 'text-right'
							},
							'readonly': true
						},
						'weightinggroup': {
							'grid': {
								formatter: businessPartnerCustomFormatters.percentFormatter,
								cssClass: 'text-right'
							},
							'readonly': true
						},
						'total': {
							'grid': {
								formatter: businessPartnerCustomFormatters.numberForTwoDecimalPlace,
								cssClass: 'text-right'
							},
							'readonly': true
						},
						'icon': {
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-evaluation-schema-icon-combobox'
							},
							'grid': {
								lookupField: 'Icon',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'businessPartnerEvaluationSchemaIcon',
									displayMember: 'Description',
									imageSelector: 'businessPartnerEvaluationSchemaIconProcessor'
								}
							},
							'readonly': true
						},
						'formula': {
							'readonly': true,
							'width': 100
						},
						'grouporder': {
							'readonly': true,
							'width': 60
						},
						'commenttext': {
							'readonly': true,
							'width': 100
						},
						'iconcommenttext': {
							'readonly': true,
							'width': 100
						}
					}
				};
			}
		]);

	// Screen Business Partner Evaluation Document Data
	angular.module(moduleName).factory('businessPartnerEvaluationDocumentDataDetailLayout',
		[function () {
			return {
				'fid': 'businessPartner.main.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['documenttypefk', 'description', 'documentdate', 'originfilename']
					},
					{
						'gid': 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [cloudCommonModule, prcCommonName, moduleName],
					'extraWords': {
						'DocumentTypeFk': {
							'location': moduleName,
							'identifier': 'documentType',
							'initial': 'Document Type'
						},
						'Description': {
							'location': prcCommonName,
							'identifier': 'documentDescription',
							'initial': 'Description'
						},
						'DocumentDate': {
							'location': moduleName,
							'identifier': 'documentDate',
							'initial': 'Document Date'
						},
						'OriginFileName': {
							'location': prcCommonName,
							'identifier': 'documentOriginFileName',
							'initial': 'Origin File Name'
						}
					}
				},
				'overloads': {
					'documenttypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'basics-lookupdata-table-document-type-combobox'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'documentType', 'displayMember': 'Description'},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-table-document-type-combobox',
								'descriptionMember': 'Description'
							}
						}
					},
					'originfilename': {
						readonly: true
					}
				}
			};
		}
		]);

	angular.module(moduleName).factory('businesspartnerMainDiscardDuplicateDialogLayout',
		['basicsCommonComplexFormatter',
			function (complexFormatter) {
				return {
					getStandardConfigForListView: function () {
						return {
							addValidationAutomatically: true,
							columns: [
								{
									id: 'bpName1',
									field: 'BusinessPartnerName1',
									name$tr$: 'businesspartner.main.name1',
									formatter: 'description',
									width: 180
								},
								{
									id: 'bpName2',
									field: 'BusinessPartnerName2',
									name$tr$: 'businesspartner.main.name2',
									formatter: 'description',
									width: 180
								},
								{
									id: 'city',
									field: 'SubsidiaryDescriptor.AddressDto.City',
									name: 'City',
									name$tr$: 'basics.common.entityCity',
									formatter: complexFormatter,
									width: 200
								},
								{
									id: 'address',
									field: 'SubsidiaryDescriptor.AddressDto.Address',
									name: 'Address',
									name$tr$: 'basics.common.entityAddress',
									formatter: complexFormatter,
									width: 200
								},
								{
									id: 'telepone',
									field: 'SubsidiaryDescriptor.TelephoneNumber1Dto.Telephone',
									name: 'Telephone',
									name$tr$: 'businesspartner.main.telephoneNumber',
									formatter: complexFormatter,
									width: 200
								},
								{
									id: 'fax',
									field: 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto.Telephone',
									name: 'Telefax',
									name$tr$: 'businesspartner.main.Telefax',
									formatter: complexFormatter,
									width: 200
								},
								{
									id: 'email',
									field: 'Email',
									name: 'E-Mail',
									name$tr$: 'businesspartner.main.email',
									formatter: complexFormatter,
									width: 180
								}
							]
						};
					}
				};
			}
		]);

	angular.module(moduleName).factory('businessPartnerCustomerCompanyLayout',
		['basicsLookupdataConfigGeneratorExtension',
			function (basicsLookupdataConfigGeneratorExtension) {
				return {
					'fid': 'businessPartner.main.customercompany.detail',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['bascompanyfk', 'supplierno', 'customerledgergroupfk', 'businesspostinggroupfk', 'vatgroupfk', 'baspaymentmethodfk', 'baspaymenttermpafk', 'baspaymenttermfifk', 'bankfk',
								'customerledgergroupicfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName, cloudCommonModule],
						'extraWords': {
							BasCompanyFk: {
								location: cloudCommonModule,
								identifier: 'entityCompany',
								initial: 'Company'
							},
							Supplierno: {
								location: moduleName,
								identifier: 'supplierNo',
								initial: 'Supplier No'
							},
							CustomerLedgerGroupFk: {
								location: moduleName,
								identifier: 'ledgerGroup',
								initial: 'Ledger Group'
							},
							BusinessPostingGroupFk: {
								location: moduleName,
								identifier: 'businessPostingGroup',
								initial: 'Business Posting Group'
							},
							VatGroupFk: {
								location: moduleName,
								identifier: 'vatGroup',
								initial: 'Vat Group'
							},
							BasPaymentMethodFk: {
								location: cloudCommonModule,
								identifier: 'entityBasPaymentMethod',
								initial: 'Payment Method'
							},
							BasPaymentTermPaFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermPA',
								initial: 'Payment Term(PA)'
							},
							BasPaymentTermFiFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermFI',
								initial: 'Payment Term (FI)'
							},
							BankFk: {
								location: cloudCommonModule,
								identifier: 'entityBankName',
								initial: 'Bank'
							},
							CustomerLedgerGroupIcFk: {
								location: moduleName,
								identifier: 'ledgerGroupIcRecharging',
								initial: 'Ledger Group IC Recharging'
							}
						}
					},
					'overloads': {
						'bascompanyfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup',
									lookupOptions: {
										filterKey: 'business-partner-customer-company-company-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'Code'
								},
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'Code',
									lookupOptions: {
										filterKey: 'business-partner-customer-company-company-filter'
									}
								}
							}
						},
						'customerledgergroupfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-customer-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-customercompany-customerledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CustomerLedgerGroup',
									displayMember: 'Description'
								},
								width: 145
							}
						},
						'vatgroupfk': {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'VatGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								'editor': 'lookup',
								'editorOptions': {
									directive: 'business-partner-vat-group-lookup',
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-vat-group-lookup',
								'options': {
									showClearButton: true,
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'businesspostinggroupfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-business-posting-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-customercompany-businesspostinggroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'DescriptionInfo.Translated',
									lookupType: 'BusinessPostingGroup'
								}
							}
						},
						'baspaymentmethodfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.paymentmethod', null, {showClearButton: true}),
						'baspaymenttermpafk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'baspaymenttermfifk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'supplierno': {},
						'bankfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'business-partner-customer-company-bank-filter',
										disableInput: true,
										displayMember: 'BankIbanWithName'
									},
									directive: 'business-partner-bank-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'businesspartner.main.bank',
									displayMember: 'BankIbanWithName'
								}
							}
						},
						'customerledgergroupicfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-customer-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-customercompany-customerledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'CustomerLedgerGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 145
							}
						}
					},
					'addition': {}
				};
			}
		]);

	angular.module(moduleName).factory('businessPartnerSupplierCompanyLayout',
		['basicsLookupdataConfigGeneratorExtension',
			function (basicsLookupdataConfigGeneratorExtension) {
				return {
					'fid': 'businessPartner.main.suppliercompany.detail',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['bascompanyfk', 'customerno', 'supplierledgergroupfk', 'businesspostinggroupfk', 'vatgroupfk', 'businesspostgrpwhtfk', 'baspaymentmethodfk', 'baspaymenttermpafk', 'baspaymenttermfifk', 'bankfk',
								'supplierledgergroupicfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							BasCompanyFk: {
								location: cloudCommonModule,
								identifier: 'entityCompany',
								initial: 'Company'
							},
							CustomerNo: {
								location: moduleName,
								identifier: 'customerNo',
								initial: 'Customer No'
							},
							SupplierLedgerGroupFk: {
								location: moduleName,
								identifier: 'ledgerGroup',
								initial: 'Ledger Group'
							},
							BusinessPostingGroupFk: {
								location: moduleName,
								identifier: 'businessPostingGroup',
								initial: 'Business Posting Group'
							},
							VatGroupFk: {
								location: moduleName,
								identifier: 'vatGroup',
								initial: 'Vat Group'
							},
							BusinessPostGrpWhtFk: {
								location: cloudCommonModule,
								identifier: 'entityBusinessPostGrpWht',
								initial: 'Posting Group Withholding Tax'
							},
							BasPaymentMethodFk: {
								location: cloudCommonModule,
								identifier: 'entityBasPaymentMethod',
								initial: 'Payment Method'
							},
							BasPaymentTermPaFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermPA',
								initial: 'Payment Term(PA)'
							},
							BasPaymentTermFiFk: {
								location: cloudCommonModule,
								identifier: 'entityPaymentTermFI',
								initial: 'Payment Term (FI)'
							},
							BankFk: {
								location: cloudCommonModule,
								identifier: 'entityBankName',
								initial: 'Bank'
							},
							SupplierLedgerGroupIcFk: {
								location: moduleName,
								identifier: 'ledgerGroupIcRecharging',
								initial: 'Ledger Group IC Recharging'
							}
						}
					},
					'overloads': {
						'bascompanyfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup',
									lookupOptions: {
										filterKey: 'business-partner-supplier-company-company-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'Code'
								},
								width: 140
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'Code',
									lookupOptions: {
										filterKey: 'business-partner-supplier-company-company-filter'
									}
								}
							}
						},
						'supplierledgergroupfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-supplier-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-suppliercompany-supplierledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SupplierLedgerGroup',
									displayMember: 'Description'
								},
								width: 125
							}
						},
						'vatgroupfk': {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'VatGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								'editor': 'lookup',
								'editorOptions': {
									directive: 'business-partner-vat-group-lookup',
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-vat-group-lookup',
								'options': {
									showClearButton: true,
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'businesspostinggroupfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-business-posting-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-suppliercompany-businesspostinggroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'DescriptionInfo.Translated',
									lookupType: 'BusinessPostingGroup'
								}
							}
						},
						'baspaymenttermpafk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'baspaymenttermfifk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'basics-lookupdata-payment-term-lookup',
									'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
								'width': 80
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookupdata-payment-term-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {'showClearButton': true}
								}
							}
						},
						'customerno': {},
						'businesspostgrpwhtfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.postinggroupwithholdingtax', null, {showClearButton: true}),
						'baspaymentmethodfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.paymentmethod', null, {showClearButton: true}),
						'bankfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'business-partner-supplier-company-bank-filter',
										disableInput: true,
										displayMember: 'BankIbanWithName'
									},
									directive: 'business-partner-bank-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'businesspartner.main.bank',
									displayMember: 'BankIbanWithName'
								}
							}
						},
						'supplierledgergroupicfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-supplier-ledger-group-combobox',
									lookupOptions: {
										filterKey: 'business-partner-main-suppliercompany-supplierledgergroup-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SupplierLedgerGroup',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 125
							}
						}
					},
					'addition': {}
				};
			}
		]);

	// Business Partner Guarantor
	angular.module(moduleName).factory('businessPartnerGuarantorLayout',
		['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', function (basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {
			var filters = [
				{
					key: 'businesspartner-guarantordetail-guaranteetype-filter',
					// eslint-disable-next-line no-unused-vars
					fn: function (certificateStatusItem, certificate){
						return certificateStatusItem.Isbond === true;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);
			return {
				'fid': 'businesspartner.main.guarantor.form',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['companyfk', 'guarantortypefk', 'creditline', 'guaranteefee', 'guaranteefeeminimum', 'guaranteepercent', 'amountmaximum', 'amountmaximumtext', 'commenttext', 'rhythmfk', 'guaranteetypefk', 'guaranteestartdate', 'guaranteeenddate', 'guarantoractive', 'amountremaining', 'amountcalledoff', 'guaranteetype1', 'guaranteetype2', 'guaranteetype3', 'guaranteetype4', 'guaranteetype5', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'bpdissuerbusinesspartnerfk', 'issuer', 'requireddate', 'expirationdate', 'dischargeddate', 'validateddate', 'date', 'validfrom', 'validto', 'currencyfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'companyfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-company-company-lookup',
								lookupOptions: {
									displayMember: 'Code',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'Code'
							},
							width: 140
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					'currencyfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-currency-combobox',
								lookupOptions: {}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'currency', 'displayMember': 'Currency'}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-currency-combobox',
							'options': {}
						}
					},
					'rhythmfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.rythm'),
					'guarantortypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.guarantortype'),
					'guaranteetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.certificatetype', null, {
						field: 'isBond',
						filterKey: 'businesspartner-guarantordetail-guaranteetype-filter',
						customBoolProperty: 'ISBOND',
						showIcon: true
					}),
					'bpdissuerbusinesspartnerfk': {
						'type': 'directive',
						// 'directive': 'business-partner-main-business-partner-dialog',
						'directive': 'filter-business-partner-dialog-lookup',
						options: {
							filterKey: 'businesspartner-certificate-quote-bp-filter'
						}
					},
					'amountremaining': {
						'readonly': true
					},
					'amountcalledoff': {
						'readonly': true
					}
				},
				'translationInfos': {
					extraModules: [moduleName],
					extraWords: {
						CompanyFk: {
							location: cloudCommonModule,
							identifier: 'entityCompany',
							initial: 'Company'
						},
						CurrencyFk: {location: moduleName, identifier: 'currency', initial: 'Currency'},
						BusinessPartnerFk: {
							location: cloudCommonModule,
							identifier: 'entityBusinessPartner',
							initial: 'Business Partner'
						},
						GuarantorTypeFk: {
							location: moduleName,
							identifier: 'entityGuarantorType',
							initial: 'Guarantor Type'
						},
						CreditLine: {
							location: moduleName,
							identifier: 'entityCreditLine',
							initial: 'Credit Line'
						},
						GuaranteeFee: {
							location: moduleName,
							identifier: 'entityGuaranteeFee',
							initial: 'Guarantee Fee'
						},
						GuaranteeFeeMinimum: {
							location: moduleName,
							identifier: 'entityGuaranteeFeeMinimum',
							initial: 'Guarantee Fee Minimum'
						},
						GuaranteePercent: {
							location: moduleName,
							identifier: 'entityGuaranteePercent',
							initial: 'Guarantee Percent'
						},
						AmountMaximum: {
							location: moduleName,
							identifier: 'entityAmountMaximum',
							initial: 'Amount Maximum'
						},
						AmountMaximumText: {
							location: moduleName,
							identifier: 'entityAmountMaximumText',
							initial: 'Amount Maximum Text'
						},
						CommentText: {
							location: cloudCommonModule,
							identifier: 'entityCommentText',
							initial: 'Comment Text'
						},
						RhythmFk: {
							location: moduleName,
							identifier: 'entityRhythm',
							initial: 'Rhythm'
						},
						GuaranteeTypeFk: {
							location: moduleName,
							identifier: 'entityGuaranteeTypeFk',
							initial: 'Guarantee Type'
						},
						GuaranteeStartDate: {
							location: moduleName,
							identifier: 'entityGuaranteeStartDate',
							initial: 'Guarantee Start Date'
						},
						GuaranteeEndDate: {
							location: moduleName,
							identifier: 'entityGuaranteeEndDate',
							initial: 'Guarantee End Date'
						},
						GuarantorActive: {
							location: moduleName,
							identifier: 'entityGuarantorActive',
							initial: 'Guarantor Active'
						},
						AmountRemaining: {
							location: moduleName,
							identifier: 'entityAmountRemaining',
							initial: 'Amount Remaining'
						},
						AmountCalledOff: {
							location: moduleName,
							identifier: 'entityAmountCalledOff',
							initial: 'Amount Called Off'
						},
						// 'bpdissuerbusinesspartnerfk', 'issuer', 'requireddate', 'expirationdate', 'dischargeddate', 'validateddate', 'date', 'validfrom', 'validto'
						BpdIssuerbusinesspartnerFk: {
							location: moduleName,
							identifier: 'entityBpdIssuerbusinesspartnerFk',
							initial: 'Issuer BusinessPartner'
						},
						Issuer: {
							location: moduleName,
							identifier: 'entityIssuer',
							initial: 'Issuer'
						},
						RequiredDate: {
							location: moduleName,
							identifier: 'entityRequiredDate',
							initial: 'Required Date'
						},
						ExpirationDate: {
							location: moduleName,
							identifier: 'entityExpirationDate',
							initial: 'Expiration Date'
						},
						DischargedDate: {
							location: moduleName,
							identifier: 'entityDischargedDate',
							initial: 'Discharged Date'
						},
						ValidatedDate: {
							location: moduleName,
							identifier: 'entityValidatedDate',
							initial: 'Validated Date'
						},
						Validfrom: {
							location: moduleName,
							identifier: 'entityValidfrom',
							initial: 'Validfrom'
						},
						Validto: {
							location: moduleName,
							identifier: 'entityValidto',
							initial: 'Validto'
						},
						Date: {
							location: moduleName,
							identifier: 'entityDate',
							initial: 'Date'
						},
						GuaranteeType1: {
							location: moduleName,
							identifier: 'entityGuaranteeType',
							initial: 'Guarantee Type 1',
							param: {'p_0': '1'}
						},
						GuaranteeType2: {
							location: moduleName,
							identifier: 'entityGuaranteeType',
							initial: 'Guarantee Type 2',
							param: {'p_0': '2'}
						},
						GuaranteeType3: {
							location: moduleName,
							identifier: 'entityGuaranteeType',
							initial: 'Guarantee Type 3',
							param: {'p_0': '3'}
						},
						GuaranteeType4: {
							location: moduleName,
							identifier: 'entityGuaranteeType',
							initial: 'Guarantee Type 4',
							param: {'p_0': '4'}
						},
						GuaranteeType5: {
							location: moduleName,
							identifier: 'entityGuaranteeType',
							initial: 'Guarantee Type 5',
							param: {'p_0': '5'}
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
						UserDefined4: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 4',
							param: {'p_0': '4'}
						},
						UserDefined5: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 5',
							param: {'p_0': '5'}
						}
					}
				},
				addition: {
					grid: [{
						'afterId': 'companyfk',
						'id': 'CompanyName',
						field: 'CompanyFk',
						'name': 'Company Name',
						'name$tr$': 'cloud.common.entityCompanyName',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'CompanyName'
						},
						width: 140
					}]
				}
			};

		}]);

	// Business Partner Guarantee Used
	angular.module(moduleName).factory('businessPartnerGuaranteeUsedLayout', [function () {
		return {
			'fid': 'businesspartner.main.guarantee.used.form',
			'version': '1.0.0',
			'addValidationAutomatically': false,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['certificatetypefk', 'ordheaderfk', 'amount', 'certificatedate', 'validfrom', 'validto', 'dischargeddate']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				extraModules: [moduleName],
				extraWords: {
					CertificateTypeFk: {
						location: moduleName,
						initial: 'Guarantee Type'
					},
					OrdHeaderFk: {
						location: moduleName,
						initial: 'Sales Contract'
					},
					Amount: {
						location: moduleName,
						initial: 'Amount'
					},
					CertificateDate: {
						location: moduleName,
						initial: 'Date'
					},
					ValidFrom: {
						location: moduleName,
						initial: 'Valid From'
					},
					ValidTo: {
						location: moduleName,
						initial: 'Valid To'
					},
					DischargedDate: {
						location: moduleName,
						initial: 'Discharged Date'
					},
				}
			},
			'overloads': {
				'ordheaderfk': {
					'navigator': {
						moduleName: 'sales.contract'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'sales-common-contract-dialog',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SalesContract',
							displayMember: 'Code'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'sales-common-contract-dialog',
							'descriptionMember': 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true,
								lookupType: 'SalesContract'
							}
						},
						'change': 'formOptions.onPropertyChanged'
					},
					'readonly': true
				},
				'certificatetypefk': {
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'businesspartner-certificate-certificate-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CertificateType',
							displayMember: 'Description'
						},
						width: 80
					},
					'detail': {
						'type': 'directive',
						'directive': 'businesspartner-certificate-certificate-type-combobox',
						'options': {
							descriptionMember: 'Description'
						}
					},
					'readonly': true
				},
				'amount': {
					'readonly': true
				},
				'certificatedate': {
					'readonly': true
				},
				'validfrom': {
					'readonly': true
				},
				'validto': {
					'readonly': true
				},
				'dischargeddate': {
					'readonly': true
				}
			}
		};
	}]);

	// BusinessPartner2External
	angular.module(moduleName).factory('businessPartnerMainBusinessPartner2ExternalLayout', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'businesspartner.main.businesspartnertoexternal.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['basexternalsourcefk','externalid','externaldescription']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName,basicsCustomizeModule],
					'extraWords': {
						BasExternalsourceFk: {
							location: basicsCustomizeModule,
							identifier: 'externalsource',
							initial: 'External Source'
						},
						ExternalId: {
							location: moduleName,
							identifier: 'externalid',
							initial: 'External Id'
						},
						ExternalDescription: {
							location: moduleName,
							identifier: 'externaldescription',
							initial: 'External Description'
						}
					}
				},
				'overloads': {
					'basexternalsourcefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsource', 'Description')
				}
			};
		}]);

	// UpdateRequest
	angular.module(moduleName).factory('businesspartnerMainUpdateRequestLayout',
		[
			function () {
				return {
					'fid': 'businesspartner.main.updateRequestTitle',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['updatesource', 'updatetable', 'updatecolumn', 'objectfk', 'objectfkdescription',
								'objectfknew', 'oldvalue', 'newvalue', 'newvaluedescription', 'isaccepted', 'commenttext', 'messagetext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							Updatesource: {location: moduleName, identifier: 'updateSource', initial: 'Update Source'},
							Updatetable: {location: moduleName, identifier: 'updateTable', initial: 'Update Table'},
							Updatecolumn: {location: moduleName, identifier: 'updateColumn', initial: 'Update Column'},
							ObjectFk: {location: moduleName, identifier: 'objectFk', initial: 'Object Id'},
							ObjectFkDescription: {location: moduleName, identifier: 'objectFkDescription', initial: 'Object Id Description'},
							ObjectFkNew: {location: moduleName, identifier: 'objectFkNew', initial: 'Object Id New'},
							OldValue: {location: moduleName, identifier: 'oldValue', initial: 'Old Value'},
							NewValue: {location: moduleName, identifier: 'newValue', initial: 'New Value'},
							NewValueDescription: {location: moduleName, identifier: 'newValueDescription', initial: 'New Value Description'},
							Isaccepted: {location: moduleName, identifier: 'isAccepted', initial: 'Is Accepted'},
							CommentText: {location: moduleName, identifier: 'commentText', initial: 'Comment Text'},
							MessageText: {location: moduleName, identifier: 'messageText', initial: 'Message Text'}
						}
					},
					'overloads': {
						'updatesource': {readonly: true},
						'updatetable': {readonly: true},
						'updatecolumn': {readonly: true},
						'objectfk': {readonly: true},
						'objectfkdescription': {readonly: true},
						'objectfknew': {readonly: true},
						'oldvalue': {readonly: true},
						'newvalue': {readonly: true},
						'newvaluedescription': {readonly: true},
						'messagetext': {readonly: true}
					}
				};
			}
		]);

	// Business Partner Create Service
	angular.module(moduleName).factory('businessPartnerCreateService', ['$http', '$q', 'businesspartnerMainHeaderDataService', function ($http, $q, bizPartnerDataService) {
		var service = {};
		service.createItem = function (creationOptions, customCreationData) {
			return bizPartnerDataService.createItemSimple(creationOptions, customCreationData, function (data) {
				var request = {PKey1: data.main.Id};
				$http.post(globals.webApiBaseUrl + 'businesspartner/main/subsidiary/create', request).then(function (response) {
					data.main.SubsidiaryDescriptor = response.data;
					service.updateData.SubsidiaryDescriptor = response.data;
					service.updateData.SubsidiaryDescriptor.IsMainAddress = true;
				});
				service.updateData = data.main;
				return data.main;
			});
		};

		service.update = function (data) {
			var bpdData = !_.isNil(data) ? data : service.updateData;
			bpdData.SubsidiaryDescriptor.Description = bpdData.BusinessPartnerName1;
			return bizPartnerDataService.updateSimple({
				'BusinessPartners': [bpdData],
				'EntitiesCount': 1
			});
		};
		service.deleteItem = function () {
			service.updateData = null;
			return $q.when(true);
		};
		return service;
	}]);

	// Business Partner Create Options
	angular.module(moduleName).factory('businessPartnerCreateOptions', ['$injector', function ($injector) {
		return {
			dataService: 'businessPartnerCreateService',
			uiStandardService: $injector.get('businessPartnerMainBusinessPartnerUIStandardService'),
			validationService: 'businesspartnerMainHeaderValidationService',
			fields: ['BusinessPartnerName1', 'BusinessPartnerName2', 'MatchCode', 'Internet', 'Email'],
			creationData: {mainItemId: null}
		};
	}]);

	// Business Partner Detail Options
	angular.module(moduleName).factory('businessPartnerDetailOptions', ['$http', '$q',
		function ($http, $q) {
			return {
				isEditable: true,
				dataService: 'businessPartnerCreateService',
				uiStandardService: 'businessPartnerMainBusinessPartnerUIStandardService',
				validationService: 'businesspartnerMainHeaderValidationService',
				readonlyFields: [],
				detailConverter: function (lookupDto) {
					if (_.isNumber(lookupDto.Id)) {
						var defer = $q.defer();
						$http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/getItem?mainItemId=' + lookupDto.Id).then(function (response) {
							defer.resolve(response.data);
						});
						return defer.promise;
					}
				}
			};
		}]);

	angular.module(moduleName).factory('businessPartnerCustomFormatters', ['typeExtensionsService', 'platformSchemaService',
		function (typeExtensionsService, platformSchemaService) {
			var service = {};

			service.percentFormatter = function () {
				var value = arguments[2];
				if (value === null && arguments[3] && arguments[4]) {
					value = arguments[4][arguments[3].field];
				}
				if (value === null || value === '' || value === 0) {
					if (arguments[3].field === 'WeightingGroup') {
						return '';
					}
					value = 0;
				}

				return typeExtensionsService.numberToUserLocaleNumberString(value, 1) + '%';
			};

			service.numberForTwoDecimalPlace = function () {
				var value = arguments[2];
				if (value === null && arguments[3] && arguments[4]) {
					value = arguments[4][arguments[3].field];
				}
				if (value === null || value === '' || value === 0) {
					if (arguments[3].field === 'Total') {
						return '';
					}
					value = 0;
				}

				return typeExtensionsService.numberToUserLocaleNumberString(value, 2);
			};

			service.getCustomizeMaxLen = function () {
				var maxLen;
				var prop = arguments[0];
				if (prop) {
					var attributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'BusinessPartnerDto',
						moduleSubModule: 'BusinessPartner.Main'
					});
					if(!_.isNil(attributeDomains)){
						maxLen = attributeDomains.properties[prop].maxlen;
					}
				}
				return maxLen;
			};

			return service;
		}]);

	angular.module(moduleName).value('businessPartnerMainCommunityLayout', {

		'fid': 'businesspartner.main.community.detail',
		'version': '1.1.0',
		'showGrouping': true,
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['bidderfk', 'subsidiaryfk', 'commenttext','percentage']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [moduleName, basicsCommonModule],
			'extraWords': {
				BidderFk: {
					location: moduleName,
					identifier: 'communityBidderFk',
					initial: 'Business Partner'
				},
				SubsidiaryFk: {
					location: moduleName,
					identifier: 'communitySubsidiaryFk',
					initial: 'Subsidiary Description'
				},
				CommentText: {
					location: basicsCommonModule,
					identifier: 'entityCommentText',
					initial: 'Comment Text'
				},
				Percentage: {
					location: moduleName,
					identifier: 'entityPercentage',
					initial: 'Percentage'
				}
			}
		},
		'overloads': {
			'bidderfk': {
				'detail': {
					'type': 'directive',
					// 'directive': 'business-partner-main-business-partner-dialog',
					'directive': 'filter-business-partner-dialog-lookup',
					'options': {
						displayMember: 'BusinessPartnerName1',
						showClearButton: false,
						IsShowBranch: true,
						SubsidiaryField: 'SubsidiaryFk',
						mainService: 'businessPartnerMainCommunityService'
						// filterKey: 'businesspartner-community-businesspartner-filter'
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						// 'directive': 'business-partner-main-business-partner-dialog',
						'directive': 'filter-business-partner-dialog-lookup',
						lookupOptions: {
							showClearButton: false,
							IsShowBranch: true,
							SubsidiaryField: 'SubsidiaryFk',
							mainService: 'businessPartnerMainCommunityService'
							// filterKey: 'businesspartner-community-businesspartner-filter'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					},
					width: 150
				}
			},
			'subsidiaryfk': {
				'detail': {
					'type': 'directive',
					'directive': 'business-partner-main-subsidiary-lookup',
					'options': {
						showClearButton: true,
						displayMember: 'SubsidiaryDescription'
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-subsidiary-lookup',
						lookupOptions: {
							displayMember: 'SubsidiaryDescription'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Subsidiary',
						displayMember: 'SubsidiaryDescription'
					},
					width: 150
				},
				readonly: true
			}
		}
	});
})(angular);
