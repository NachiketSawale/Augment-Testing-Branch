/**
 * Created by wed on 1/8/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationDetailLayoutFactory', [
		'$translate',
		'basicsLookupdataConfigGenerator',
		'platformGridDomainService',
		'basicsCommonChangeStatusService',
		'commonBusinessPartnerEvaluationServiceCache',
		function ($translate,
			basicsLookupdataConfigGenerator,
			platformGridDomainService,
			basicsCommonChangeStatusService,
			serviceCache) {

			function createLayout(serviceDescriptor) {

				if (serviceCache.hasService(serviceCache.serviceTypes.EVALUATION_DETAIL_LAYOUT, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.EVALUATION_DETAIL_LAYOUT, serviceDescriptor);
				}
				var cloudCommonModule = 'cloud.common',
					basicsCustomizeModule = 'basics.customize',
					detailLayout = {
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
								Remark2: {location: cloudCommonModule, identifier: 'entityRemark2', initial: 'Remark2s'},
								ProjectFk: {
									location: cloudCommonModule,
									identifier: 'entityProject',
									initial: 'Project'
								},
								ConHeaderFk: {location: moduleName, identifier: 'entityContract', initial: 'Contract'},
								InvHeaderFk: {location: moduleName, identifier: 'entityInvoice', initial: 'Invoice'},
								QtnHeaderFk: {
									location: moduleName,
									identifier: 'entityQuotation',
									initial: 'Quotation'
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
							'code': {
								'detail': {
									'regex': '^[\\s\\S]{0,255}$',
									'maxLength': 255
								}
							},
							'evalstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.evaluationstatus', null, {showIcon: true}),
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
										directive: 'business-partner-main-filtered-contact-combobox',
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
									'directive': 'business-partner-main-filtered-contact-combobox',
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
										directive: 'business-partner-main-filtered-contact-combobox',
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
									'directive': 'business-partner-main-filtered-contact-combobox',
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

				serviceCache.setService(serviceCache.serviceTypes.EVALUATION_DETAIL_LAYOUT, serviceDescriptor, detailLayout);

				return detailLayout;

			}

			return {
				createLayout: createLayout
			};
		}
	]);

})(angular);