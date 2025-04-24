/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';
	var basicsCommonModule = 'basics.common';
	var salesCommonModule = 'sales.common';
	var cloudCommonModule = 'cloud.common';
	var qtoMainModule='qto.main';

	angular.module(moduleName).factory('defectMainHeaderLayout', ['basicsLookupdataConfigGenerator', 'defectMainHeaderDataService', 'basicsCommonComplexFormatter',
		'modelViewerTranslationModules',

		function (basicsLookupdataConfigGenerator, defectMainHeaderDataService, basicsCommonComplexFormatter,
			modelViewerTranslationModules) {
			function changeOrderLookupOptions(){
				return {
					showClearButton: true,
					showAddButton: true,
					filterKey: 'document-project-document-common-filter',
					createOptions:{
						typeOptions: {
							isProcurement: false,
							isChangeOrder: false
						},
						IsChangeOrder: false,
						handleCreateSuccessAsync: function($injector, createItem, entity){
							let $q = $injector.get('$q');
							if (createItem) {
								entity.changefk = createItem.Id;
								entity.changeCode = createItem.Code;
								entity.changeDescription = createItem.Description;
								defectMainHeaderDataService.markCurrentItemAsModified();
							}
							return $q.when(true);
						}
					}
				}
			}

			var addColumns = [{
				id: 'Description',
				field: 'DescriptionInfo',
				name: 'Description',
				width: 300,
				formatter: 'translation',
				name$tr$: 'cloud.common.entityDescription'
			}];
			var config;
			config = {
				'fid': 'main.header.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule, basicsCommonModule, salesCommonModule,qtoMainModule].concat(modelViewerTranslationModules),
					'extraWords': {
						'Code': {
							'location': cloudCommonModule,
							'identifier': 'entityReferenceCode',
							'initial': 'Reference Code'
						},
						'Description': {
							'location': cloudCommonModule,
							'identifier': 'entityReferenceName',
							'initial': 'entityReferenceName'
						},
						'Detail':{
							'location': cloudCommonModule,
							'identifier': 'details',
							'initial': 'Details'
						},
						'DfmStatusFk': {
							'location': cloudCommonModule,
							'identifier': 'entityStatus',
							'initial': 'Status'
						},
						'ChangeFk':{
							'location': moduleName,
							'identifier': 'changeFk',
							'initial': 'ChangeFk'
						},
						'Defect2ChangeTypeFk':{
							'location': moduleName,
							'identifier': 'defect2ChangeType',
							'initial': 'Defect2ChangeTypeFk'
						},
						'BasDefectTypeFk': {
							'location': moduleName,
							'identifier': 'entityBasDefectTypeFk',
							'initial': 'Type'
						},
						'RubricCategoryFk': {
							'location': cloudCommonModule,
							'identifier': 'entityBasRubricCategoryFk',
							'initial': 'Rubric Category'
						},
						'PrcStructureFk': {
							'location': basicsCommonModule,
							'identifier': 'entityPrcStructureFk',
							'initial': 'Procurement Structure'
						},
						'DfmGroupFk': {
							'location': moduleName,
							'identifier': 'entityDfmGroupFk',
							'initial': 'Group'
						},
						'DfmDefectFk': {
							'location': moduleName,
							'identifier': 'entityDfmDefectFk',
							'initial': 'Reference Defect'
						},
						'PrjProjectFk': {
							'location': moduleName,
							'identifier': 'entityPrjProjectFk',
							'initial': 'Project'
						},
						'PrjLocationFk': {
							'location': moduleName,
							'identifier': 'entityPrjLocationFk',
							'initial': 'Location'
						},
						'ConHeaderFk': {
							'location': moduleName,
							'identifier': 'entityConHeaderFk',
							'initial': 'Procurement Contract'
						},
						'OrdHeaderFk': {
							'location': moduleName,
							'identifier': 'entityOrdHeaderFk',
							'initial': 'Sales Contract'
						},
						'PriorityFk': {
							'location': moduleName,
							'identifier': 'entityBasDefectPriorityFk',
							'initial': 'Priority'
						},
						'BasDefectSeverityFk': {
							'location': moduleName,
							'identifier': 'entityBasDefectSeverityFk',
							'initial': 'Severity'
						},
						'PsdScheduleFk': {
							'location': moduleName,
							'identifier': 'entityPsdScheduleFk',
							'initial': 'Schedule'
						},
						'PsdActivityFk': {
							'location': moduleName,
							'identifier': 'entityPsdActivityFk',
							'initial': 'Activity'
						},
						'MdcControllingunitFk': {
							'location': moduleName,
							'identifier': 'entityMdcControllingunitFk',
							'initial': 'Controlling Unit'
						},
						'DateIssued': {
							'location': moduleName,
							'identifier': 'entityDateIssued',
							'initial': 'Date Issued'
						},
						'DateRequired': {
							'location': moduleName,
							'identifier': 'entityDateRequired',
							'initial': 'Date Required'
						},
						'DateFinished': {
							'location': moduleName,
							'identifier': 'entityDateFinished',
							'initial': 'Date Finished'
						},
						'BasWarrantyStatusFk': {
							'location': moduleName,
							'identifier': 'entityBasWarrantyStatusFk',
							'initial': 'Warranty Status'
						},
						'EstimateLaborHours': {
							'location': moduleName,
							'identifier': 'entityEstimateLaborHours',
							'initial': 'Labor Hours'
						},
						'EstimateCost': {
							'location': moduleName,
							'identifier': 'entityEstimateCost',
							'initial': 'Estimate Cost'
						},
						'BasCurrencyFk': {
							'location': moduleName,
							'identifier': 'entityBasCurrencyFk',
							'initial': 'Currency'
						},
						'BasClerkFk': {
							'location': moduleName,
							'identifier': 'entityBasClerkFk',
							'initial': 'Detected By Clerk'
						},
						'DfmRaisedbyFk': {
							'location': moduleName,
							'identifier': 'entityDfmRaisedbyFk',
							'initial': 'Raised By'
						},
						'BpdBusinesspartnerFk': {
							'location': moduleName,
							'identifier': 'entityBpdBusinesspartnerFk',
							'initial': 'Responsible BP'
						},
						'BpdSubsidiaryFk': {
							'location': moduleName,
							'identifier': 'entityBpdSubsidiaryFk',
							'initial': 'Responsible BP Subsidiary'
						},
						'BpdContactFk': {
							'location': moduleName,
							'identifier': 'entityBpdContactFk',
							'initial': 'Responsible BP Contact'
						},
						'BasClerkRespFk': {
							'location': moduleName,
							'identifier': 'entityBasClerkRespFk',
							'initial': 'Responsible Clerk'
						},
						'Isexternal': {
							'location': moduleName,
							'identifier': 'entityIsexternal',
							'initial': 'External Defect'
						},
						'Userdate1': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDate',
							'initial': 'User Date 1',
							param: {'p_0': '1'}
						},
						'Userdate2': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDate',
							'initial': 'User Date 2',
							param: {'p_0': '2'}
						},
						'Userdate3': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDate',
							'initial': 'User Date 3',
							param: {'p_0': '3'}
						},
						'Userdate4': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDate',
							'initial': 'User Date 4',
							param: {'p_0': '4'}
						},
						'Userdate5': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDate',
							'initial': 'User Date 5',
							param: {'p_0': '5'}
						},
						'Userdefined1': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 1',
							param: {'p_0': '1'}
						},
						'Userdefined2': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 2',
							param: {'p_0': '2'}
						},
						'Userdefined3': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 3',
							param: {'p_0': '3'}
						},
						'Userdefined4': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 4',
							param: {'p_0': '4'}
						},
						'Userdefined5': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 5',
							param: {'p_0': '5'}
						},
						'MdlModelFk': {
							location: moduleName,
							identifier: 'entityMdlModelCode',
							initial: 'Model Code'
						},
						'MdlModelFk$Description': {
							location: moduleName,
							identifier: 'entityMdlModelDescription',
							initial: 'Model Description'
						},
						PesHeaderFk: {
							location: moduleName,
							identifier: 'entityPesHeaderFk',
							initial: 'PES'
						},
						HsqChecklistFk: {
							location: moduleName,
							identifier: 'entityHsqChecklistFk',
							initial: 'Check List'
						}
					}
				},
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'description', 'detail','dfmstatusfk', 'changefk','defect2changetypefk','basdefecttypefk','rubriccategoryfk',  'prcstructurefk', 'dfmgroupfk', 'dfmdefectfk', 'prjprojectfk', 'prjlocationfk', 'conheaderfk',
							'ordheaderfk', 'basdefectseverityfk', 'psdschedulefk', 'psdactivityfk', 'mdccontrollingunitfk', 'dateissued', 'daterequired', 'datefinished',
							'baswarrantystatusfk', 'estimatelaborhours', 'estimatecost', 'bascurrencyfk', 'basclerkfk', 'dfmraisedbyfk', 'bpdbusinesspartnerfk', 'bpdsubsidiaryfk', 'bpdcontactfk', 'basclerkrespfk',
							'isexternal',
							'userdate1', 'userdate2', 'userdate3', 'userdate4', 'userdate5', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'mdlmodelfk',
							'pesheaderfk', 'hsqchecklistfk','priorityfk'
						]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					code:{
						bulkSupport: false
					},
					'dfmstatusfk': {
						'grid': {
							'editor': '',
							'editorOptions': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'DfmStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'defect-main-status-combobox',
							'options': {
								readOnly: true
							}
						}
					},


					'basdefecttypefk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-defect-type-combobox',
								lookupOptions: {
									filterKey: 'defect-type-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'defectType',
								displayMember: 'DescriptionInfo.Translated'
							},
							bulkSupport: false
						},
						'detail': {
							'type': 'directive',
							'directive': 'defect-main-defect-type-combobox',
							'model': 'BasDefectTypeFk',
							'options': {
								filterKey: 'defect-type-filter',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'rubriccategoryfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							'options': {
								filterKey: 'defect-rubric-category-filter'
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RubricCategoryByRubricAndCompany',
								displayMember: 'Description'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'defect-rubric-category-filter'
								}
							}
						}
					},
					'prcstructurefk': {
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcStructure',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 100
						}
					},
					'dfmgroupfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-defect-group-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'defectGroup',
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'defect-main-defect-group-combobox',
							'model': 'DfmGroupFk',
							'options': {
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'dfmdefectfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-common-lookup-dialog',
								lookupOptions: {
									'showClearButton': true,
									filterKey: 'defect-main-reference-defect-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'DfmDefect',
								displayMember: 'Code'
							},
							'bulkSupport': false
						},
						'detail': {
							'type': 'directive',
							'directive': 'defect-main-common-lookup-dialog',
							'model': 'DfmDefectFk',
							'options': {
								filterKey: 'defect-main-reference-defect-filter',
								descriptionMember: 'Code',
								lookupOptions: {
									'showClearButton': true
								}
							}
						}
					},
					'changefk': {
						'navigator' :{
							moduleName :'change.main'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: changeOrderLookupOptions()
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-change-dialog',
								lookupOptions: changeOrderLookupOptions()
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'projectchange',
								displayMember: 'Code'
							},
							width: 130
						}
					},
					'prjprojectfk': {
						'navigator': {
							moduleName: 'project.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-project-lookup-dialog',
								'displayMember': 'ProjectName',
								'lookupOptions': {'showClearButton': false}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcProject',
								'displayMember': 'ProjectNo'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-project-lookup-dialog',
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'showClearButton': false,
									'lookupType': 'PrcProject'
								}
							}
						}
					},
					'prjlocationfk': {
						navigator: {
							moduleName: 'project.main-location'
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ProjectLocation',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-prj-location-dialog',
								'lookupOptions': {
									'filterKey': 'defect-main-location-filter',
									'showClearButton': true,
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns
								}
							},
							'width': 150,
							'bulkSupport': false
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-prj-location-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'filterKey': 'defect-main-location-filter',
									'showClearButton': true
								}
							}
						}
					},
					'conheaderfk': {
						'navigator': {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									filterKey: 'defect-main-Procurement-Contract-filter',
									showClearButton: true,
									'dialogOptions':{
										'alerts':[{
											theme:'info',
											message:'Setting procurement contract will overwrite quite a lot of related fields',
											message$tr$:'defect.main.procurementContractDialogTips'
										}]
									},
									title: {name: 'Procurement Contract', name$tr$: 'defect.main.procurementContractDialogTitle'}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							},
							'bulkSupport': false
						},
						'detail': {
							'model': 'ConHeaderFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'defect-main-Procurement-Contract-filter',
									'dialogOptions':{
										'alerts':[{
											theme:'info',
											message:'Setting procurement contract will overwrite quite a lot of related fields',
											message$tr$:'defect.main.procurementContractDialogTips'
										}]
									},
									title: {name: 'Procurement Contract', name$tr$: 'defect.main.procurementContractDialogTitle'}
								}
							}
						}
					},
					'ordheaderfk': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'defect-main--sales-contract-filter',
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'sales-common-contract-dialog',
								lookupOptions: {
									filterKey: 'defect-main--sales-contract-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesContract',
								displayMember: 'Code'
							},
							'bulkSupport': false
						}
					},
					'priorityfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.priority', 'Description'),
					'basdefectseverityfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-defect-severity-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'defectSeverity',
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'defect-main-defect-severity-combobox',
							'model': 'BasDefectSeverityFk',
							'options': {
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},

					'psdschedulefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'defectSchedulingLookupService',
						showClearButton: true,
						isComposite: true,
						bulkSupport:false,
						desMember: 'DescriptionInfo.Translated',
						dispMember: 'Code',
						filter: function (item) {
							if (item) {
								return item.PrjProjectFk ? item.PrjProjectFk : 0;
							}
							return 0;
						},
						navigator: {
							moduleName: 'scheduling.main'
						}
					}),
					'defect2changetypefk' :  basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.defect2projectchangetype'),
					'psdactivityfk': {
						// 'readonly': 'true',
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'scheduling-main-activity-structure-lookup',
								'lookupOptions': {
									'showClearButton': true,
									filterKey: 'defect-main-activity-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'SchedulingActivity',
								'displayMember': 'Code'
							},
							'bulkSupport': false
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'scheduling-main-activity-structure-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'showClearButton': true,
									filterKey: 'defect-main-activity-filter'
								}
							}
						}
					},
					'mdccontrollingunitfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-master-data-context-controlling-unit-lookup',
								'lookupOptions': {
									'filterKey': 'defect-main-controlling-unit-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'ControllingUnit', 'displayMember': 'Code'},
							'width': 80,
							'bulkSupport': false
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-master-data-context-controlling-unit-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'filterKey': 'defect-main-controlling-unit-filter',
									'showClearButton': true
								}
							}
						}
					},
					'baswarrantystatusfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-warranty-status-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'warrantyStatus',
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'defect-main-warranty-status-combobox',
							'model': 'BasWarrantyStatusFk',
							'options': {
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'estimatelaborhours': {
						'grid': {
							'editorOptions': {'decimalPlaces': 2}
						},
						'detail': {
							'options': {
								readOnly: true,
								decimalPlaces: 2
							}
						}
					},
					'estimatecost': {
						'grid': {
							'formatter': 'money'
						},
						'detail': {
							'options': {
								readOnly: true
							}
						}
					},
					'bascurrencyfk': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-currency-combobox'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'currency',
								displayMember: 'Currency'
							}
						}
					},
					'basclerkfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'dfmraisedbyfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-raised-by-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'dfmRaisedBy',
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'defect-main-raised-by-combobox',
							'model': 'DfmRaisedbyFk',
							'options': {
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'bpdbusinesspartnerfk': {
						'navigator': {
							moduleName: 'businesspartner.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									// 'filterKey': 'prc-subcontactor-bussinesspartner-filter',
									'showClearButton': true
								}, 'directive': 'business-partner-main-business-partner-dialog'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner', 'displayMember': 'BusinessPartnerName1',
								'navigator': {
									'moduleName': 'businesspartner.main'
								}
							},
							'width': 120
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-business-partner-dialog',
							'options': {
								// 'filterKey': 'prc-subcontactor-bussinesspartner-filter',
								'showClearButton': true
							}
						}
					},
					'bpdsubsidiaryfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'filterKey': 'defect-main-subsidiary-filter',
									'showClearButton': true,
									'displayMember': 'AddressLine'
								}, 'directive': 'business-partner-main-subsidiary-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
							'width': 120,
							'bulkSupport': false
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								'filterKey': 'defect-main-subsidiary-filter',
								'showClearButton': true,
								'displayMember': 'Address'
							}
						}
					},
					'bpdcontactfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'defect-main-contact-filter', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Contact', 'displayMember': 'FullName'},
							'width': 100,
							'bulkSupport': false
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {
								'filterKey': 'defect-main-contact-filter', 'showClearButton': true
							}
						}
					},
					'basclerkrespfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'mdlmodelfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelLookupDataService',
						isComposite: true,
						enableCache: true,
						additionalColumns: false,
						desMember:'Description',
						bulkSupport:false,
						filter: function (item) {
							if(item){
								return item.PrjProjectFk;
							}
						}

					}),
					'action': {
						'grid': {
							// 'formatter': 'integer'
							'width': 150
						}
					},
					'pesheaderfk': {
						navigator: {
							moduleName: 'procurement.pes'
						},
						'detail': {
							'label$tr$': 'procurement.invoice.header.pes',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-invoice-pes-lookup',
								descriptionMember: 'Description',
								'lookupOptions': {
									'filterKey': 'defect-main-pes-header-filter',
									'showClearButton': true
								}
							}
						},
						'grid': {
							name$tr$: 'procurement.invoice.header.pes',
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-pes-lookup',
								'lookupOptions': {
									'filterKey': 'defect-main-pes-header-filter',
									'showClearButton': true
								}
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvoicePes',
								displayMember: 'Code',
								navigator: {
									moduleName: 'procurement.pes'
								}
							},
							'bulkSupport': false
						}
					},
					'hsqchecklistfk': {
						navigator: {
							moduleName: 'hsqe.checklist'
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'hsqe-checklist-header-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'hsqe-checklist-header-filter'
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'hsqe-checklist-header-lookup',
								lookupOptions: {
									'filterKey': 'hsqe-checklist-header-filter'
								}
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CheckList',
								displayMember: 'Code',
								navigator: {
									moduleName: 'hsqe.checklist'
								}
							},
							'bulkSupport': false
						}
					},
					'dateissued': {
						'bulkSupport': true
					},
					'daterequired': {
						'bulkSupport': true
					},
					'datefinished': {
						'bulkSupport': true
					},
					'isexternal': {
						'bulkSupport': true
					},
					'userdate1': {
						'bulkSupport': true
					},
					'userdate2': {
						'bulkSupport': true
					},
					'userdate3': {
						'bulkSupport': true
					},
					'userdate4': {
						'bulkSupport': true
					},
					'userdate5': {
						'bulkSupport': true
					}
				},
				'addition': {
					'grid': [
						{
							id:'projectName',
							afterId: 'prjprojectfk',
							lookupDisplayColumn: true,
							field: 'PrjProjectFk',
							displayMember: 'ProjectName',
							name$tr$: 'cloud.common.entityProjectName',
							width: 120
						}, {
							id:'controllingUnitDesc',
							lookupDisplayColumn: true,
							field: 'MdcControllingunitFk',
							displayMember: 'DescriptionInfo.Translated',
							name$tr$: 'cloud.common.entityControllingUnitDesc',
							width: 100
						}, {
							id:'structureDescription',
							lookupDisplayColumn: true,
							field: 'PrcStructureFk',
							displayMember: 'DescriptionInfo.Translated',
							name$tr$: 'cloud.common.entityStructureDescription',
							width: 120
						}, {
							id:'checklistDescription',
							lookupDisplayColumn: true,
							field: 'HsqChecklistFk',
							displayMember: 'DescriptionInfo.Translated',
							name$tr$: 'defect.main.checklistDescription',
							width: 120
						},
						{
							id:'conHeaderDescription',
							field: 'ConHeaderFk',
							name$tr$: 'defect.main.conHeaderDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConHeaderView',
								displayMember: 'Description'
							}
						},
						{
							id:'ordHeaderDescription',
							field: 'OrdHeaderFk',
							name$tr$: 'defect.main.ordHeaderDescription',
							lookupDisplayColumn: true,
							displayMember: 'DescriptionInfo.Translated',
							width: 120
						},
						{
							id:'activityDescription',
							lookupDisplayColumn: true,
							field: 'PsdActivityFk',
							name$tr$: 'defect.main.activityDescription',
							displayMember: 'Description'
						},
						{
							id:'detectedByClerkDescription',
							lookupDisplayColumn: true,
							field: 'BasClerkFk',
							name$tr$: 'defect.main.detectedByClerkDescription',
							width: 145
						},
						{
							id:'responsibleClerkDescription',
							lookupDisplayColumn: true,
							field: 'BasClerkRespFk',
							name$tr$: 'defect.main.responsibleClerkDescription',
							width: 145
						},
						{
							id:'mdlModelDescription',
							afterId: 'mdlmodelfk',
							field: 'MdlModelFk',
							name$tr$: 'defect.main.entityMdlModelDescription',
							formatter: 'lookup',
							formatterOptions: {
								dataServiceName: 'modelProjectModelLookupDataService',
								displayMember: 'Description'
							},
							width: 100
						},
						{
							id:'pesHeaderDescription',
							afterId: 'pesheaderfk',
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							name$tr$: 'procurement.invoice.header.pesHeaderDes',
							width: 180
						}
					],
					'detail': []
				}
			};
			return config;
		}]);

	angular.module(moduleName).factory('defectMainHeaderUIStandardService',
		['platformUIStandardConfigService', 'defectMainTranslationService',
			'defectMainHeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, defectMainTranslationService, defectMainHeaderLayout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DfmDefectDto',
					moduleSubModule: 'Defect.Main'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(defectMainHeaderLayout, domainSchema, defectMainTranslationService);
				platformUIStandardExtentService.extend(service, defectMainHeaderLayout.addition, domainSchema);
				return service;
			}
		]);
})(angular);
