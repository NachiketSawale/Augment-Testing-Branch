/**
 * Created by ada on 2018/4/24.
 */
(function () {
	'use strict';

	var moduleName = 'businesspartner.main',
		cloudCommonModule = 'cloud.common',
		basicsCustomizeModule = 'basics.customize';

	// Business Partner Evaluation
	angular.module(moduleName).factory('commonBusinessPartnerBusinessPartnerEvaluationDetailLayout',
		[function () {
			return {
				'fid': 'businessPartner.main.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['companyfk','checked', /* 'evaluationschemadescription', */ 'evaluationschemafk', 'description', 'points', 'code', 'evaluationdate', 'evalstatusfk','validfrom','validto']
					},
					{
						'gid': 'businessPartnerData',
						'attributes': ['subsidiaryfk', 'contact1fk', 'contact2fk']
					},
					{
						'gid': 'responsibleData',
						'attributes': ['clerkprcfk', 'clerkreqfk', 'remark','remark2']
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
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule, basicsCustomizeModule],
					'extraWords': {
						businessPartnerData: {
							location: cloudCommonModule,
							identifier: 'entityBusinessPartner',
							initial: 'Business Partner'
						},
						references: {
							location: moduleName,
							identifier: 'screenEvaluatoinReferencesGroupTitle',
							initial: 'References'
						},
						userDefined: {
							location: moduleName,
							identifier: 'groupUserDefined',
							initial: 'User Defined Fields'
						},
						responsibleData: {
							location: cloudCommonModule,
							identifier: 'entityResponsible',
							initial: 'Responsible'
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
						EvalStatusFk: {
							location: basicsCustomizeModule,
							identifier: 'evaluationstatus',
							initial: 'Evaluation Status'
						},
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
						Remark2: {location: cloudCommonModule, identifier: 'entityRemark2', initial: 'Remarks2'},
						Points: {location: moduleName, identifier: 'entityPoints', initial: 'Result'},
						// EvaluationSchemaDescription: {
						//     location: moduleName,
						//     identifier: 'entityEvaluationSchema',
						//     initial: 'Evaluation Schema'
						// },
						EvaluationSchemaFk: {
							location: moduleName,
							identifier: 'entityEvaluationSchemaFk',
							initial: 'Evaluation Schema'
						},
						Description: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
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
						InsertedAt: {
							location: cloudCommonModule,
							identifier: 'entityInsertedAt',
							initial: 'Inserted At'
						},
						InsertedBy: {
							location: cloudCommonModule,
							identifier: 'entityInsertedBy',
							initial: 'Inserted By'
						},
						UpdatedAt: {
							location: cloudCommonModule,
							identifier: 'entityUpdatedAt',
							initial: 'Updated At'
						},
						UpdatedBy: {
							location: cloudCommonModule,
							identifier: 'entityUpdatedBy',
							initial: 'Updated By'
						},
						CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
						Version: {location: cloudCommonModule, identifier: 'entityVersion', initial: 'Version'},
						ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
						ConHeaderFk: {location: moduleName, identifier: 'entityContract', initial: 'Contract'},
						InvHeaderFk: {location: moduleName, identifier: 'entityInvoice', initial: 'Invoice'},
						QtnHeaderFk: {location: moduleName, identifier: 'entityQuotation', initial: 'Quotation'}
					}
				},
				'overloads': {
					'checked': {
						isTransient: true,
						validate: function (entity, value) {
							let a = 123;
						}
					},
					// 'evaluationschemadescription': { //todo clv: here is a grid details.
					//     'navigator': {
					//         moduleName: 'businesspartner.evaluationschema',
					//         registerService: 'businesspartnerEvaluationschemaHeaderService'
					//     },
					//     'grid': {
					//         'formatter': 'description',
					//         'formatterOptions': {}
					//     },
					//     'readonly': true
					// },
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
						'readonly': true
					},
					'evaluationschemafk': {
						'navigator': {
							moduleName: 'businesspartner.evaluationschema',
							registerService: 'businesspartnerEvaluationschemaHeaderService'
						},
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
						'readonly': true
					},
					'description': {
						readonly: true
					},
					'points': {
						'readonly': true
					},
					'code': {
						'grid': {
							'regex': '^[\\s\\S]{0,255}$',
							'maxLength': 255
						},
						'readonly': true
					},
					'evaluationdate': {
						'readonly': true
					},
					'validfrom': {
						'readonly': true
					},
					'validto': {
						'readonly': true
					},
					'userdefined4': {
						'readonly': true
					},
					'userdefined5': {
						'readonly': true
					},
					'evalstatusfk': {
						'grid': {
							'editor': null,
							'formatterOptions': {
								lookupType: 'evaluationstatus',
								displayMember: 'DescriptionInfo.Description',
								imageSelector: 'platformStatusIconService'
							}
						}
					},
					'remark': {
						'readonly': true
					},
					'remark2': {
						'readonly': true
					},
					'subsidiaryfk': {
						'grid': {
							'editor': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'Subsidiary',
								displayMember: 'Address'
							}
						}
					},
					'contact1fk': {
						'grid': {
							'editor': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'contact',
								displayMember: 'FullName'
							}
						}
					},
					'contact2fk': {
						'grid': {
							'editor': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'contact',
								displayMember: 'FullName'
							}
						}
					},
					'clerkprcfk': {
						'grid': {
							'editor': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'clerk',
								displayMember: 'Code'
							}
						}
					},
					'clerkreqfk': {
						'grid': {
							'editor': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'clerk',
								displayMember: 'Code'
							}
						}
					},

					'projectfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'basics-lookup-data-project-project-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						}
					},
					'conheaderfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									filterKey: 'businesspartner-main-evaluation-conheader-filter',
									showClearButton: true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'conheader',
								displayMember: 'Code'
							}
						}
					},
					'invheaderfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'procurement-invoice-header-dialog',
								lookupOptions: {
									filterKey: 'businesspartner-main-evaluation-invheader-filter',
									showClearButton: true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'InvHeaderChained',
								'displayMember': 'Code'
							}
						}
					},
					'qtnheaderfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'procurement-quote-header-lookup',
								'lookupOptions': {
									filterKey: 'businesspartner-main-evaluation-qtnheader-filter',
									showClearButton: true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'quote',
								'displayMember': 'Code'
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
						},

						{
							afterId: 'projectfk',
							id: 'projectname',
							field: 'ProjectFk',
							name$tr$: cloudCommonModule + '.entityProjectName',
							sortable: true,
							width: 140,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectName'
							}
						},
						{
							afterId: 'conheaderfk',
							id: 'conheaderdescription',
							field: 'ConHeaderFk',
							name$tr$: 'businesspartner.main.entityContractDescription',
							sortable: true,
							width: 140,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'conheader',
								displayMember: 'Description'
							}
						},
						{
							afterId: 'invheaderfk',
							id: 'invheaderdescription',
							field: 'InvHeaderFk',
							name$tr$: 'businesspartner.main.entityInvoiceDescription',
							sortable: true,
							width: 140,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvHeaderChained',
								displayMember: 'Description'
							}
						},
						{
							afterId: 'qtnheaderfk',
							id: 'qtnheaderdescription',
							field: 'QtnHeaderFk',
							name$tr$: 'businesspartner.main.entityQuotationDescription',
							sortable: true,
							width: 140,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'quote',
								displayMember: 'Description'
							}
						}
					]
				}
			};
		}
		]);
})(angular);