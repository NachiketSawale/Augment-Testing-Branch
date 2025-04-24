/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLineItemSelStatementConfigurationService
	 * @function
	 * @description
	 * This is the data service for estimate estimateMainLineItemSelStatementConfigurationService data functions.
	 */
	angular.module(moduleName).factory('estimateMainLineItemSelStatementConfigurationService',
		['$injector', '$translate', '$filter', 'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformUIStandardExtentService', 'platformSchemaService', 'estimateMainSelStatementFilterEditorTranslateService', 'basicsLookupdataConfigGenerator', 'estimateCommonNavigationService',

			function ($injector, $translate, $filter, platformUIStandardConfigService, estimateMainTranslationService, platformUIStandardExtentService, platformSchemaService, estimateMainSelStatementFilterEditorTranslateService, basicsLookupdataConfigGenerator, estimateCommonNavigationService) {

				let getEstLineItemSelStatementDetailLayout = function getEstLineItemSelStatementDetailLayout() {
					return {
						'fid': 'estimate.main.lineItem.selection.statement',
						'version': '1.0.1',
						'showGrouping': false,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes':  ['isexecute', 'code', 'descriptioninfo',  'estassemblyfk', 'boqitemfk','boqheaderitemfk', 'wicitemfk','wiccatfk','wicheaderitemfk', 'quantity', 'selectstatement', 'loggingmessage', 'psdactivityfk', 'mdlmodelfk', 'objectselectstatement'] // 'state',
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'isexecute':{
								headerChkbox: true
							},
							'code': {
								'grid': {
									'maxLength': 16,
									'bulkSupport': false
								},
								'detail': {
									'maxLength': 16,
									'bulkSupport': false
								}
							},
							'descriptioninfo': {
								'grid': {
									'maxLength': 255,
									'editor': 'directive',
									'editorOptions': {
										'directive': 'basics-common-translate-cell',
										'dataService': 'estimateMainLineItemSelStatementListService',
										'containerDataFunction': 'getContainerData'
									},
									'formatter': 'translation'
								},
								'detail': {
									'maxLength': 255
								}
							},
							'selectstatement': {
								grid:{
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-sel-statement-input'
									},
									formatter: function(row, cell, value) {
										return estimateMainSelStatementFilterEditorTranslateService.getSelStatementTranslated(value);
									}
								}
							},
							'objectselectstatement': {
								grid:{
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-object-sel-statement-input'
									},
									formatter: function(row, cell, value) {
										return value ? JSON.parse(value).filterText: '';
									}
								}
							},
							'estassemblyfk': {
								navigator: {
									moduleName: $translate.instant('estimate.assemblies.assembly'),
									navFunc: function (triggerFieldOption, entity) {
										navigateToAssembly(triggerFieldOption, entity);
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-assembly-template-lookup',
										lookupOptions: {
											usageContext: 'estimateMainLineItemSelStatementListService',
											lookupOptions:{
												filterAssemblyKey: 'estimate-main-resources-prj-assembly-priority-filter',
											},
											showClearButton: true,
											additionalColumns: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'DescriptionInfo',
												name: 'Description',
												width: 300,
												formatter: 'translation',
												name$tr$: 'cloud.common.entityDescription'
											}]
										},
										gridOptions: {
											multiSelect: false
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estassemblyfk',
										displayMember: 'Code'
									}
								},
								mandatory: true
							},
							'boqitemfk': {
								navigator: {
									moduleName: 'boq.main',
									'navFunc': function (triggerFieldOption, item) {
										let boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
										if(boqRuleComplexLookupService){
											boqRuleComplexLookupService.setNavFromBoqProject();
											$injector.get('boqMainService').setList([]);
											let estimateMainService = $injector.get('estimateMainService');
											if(estimateMainService){
												estimateMainService.updateAndExecute(function() {
													let projectId = estimateMainService.getSelectedProjectId();
													boqRuleComplexLookupService.setProjectId(projectId);
													boqRuleComplexLookupService.loadLookupData().then(function ()
													{
														item.BoqHeaderFk = item.BoqHeaderItemFk;
														triggerFieldOption.NavigatorFrom ='EstBoqItemNavigator';
														$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, item, triggerFieldOption);
													});
												});
											}
										}
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'estimate-main-boq-item-lookup',
									'options': {
										'eagerLoad': true,
										'showClearButton': true
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-boq-item-lookup',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns': true,
											'displayMember': 'Reference',
											'addGridColumns': [
												{
													id: 'brief',
													field: 'BriefInfo',
													name: 'Brief',
													width: 120,
													toolTip: 'Brief',
													formatter: 'translation',
													name$tr$: 'estimate.main.briefInfo'
												}
											]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estboqitems',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainBoqItemService',
										mainServiceName:'estimateMainLineItemSelStatementListService'
									}
								}
							},
							'boqheaderitemfk':{
								'readonly': true,
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-root-boq-item',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns': false,
											'displayMember': 'Reference'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estBoqHeaders',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainBoqHeaderService',
										mainServiceName:'estimateMainLineItemSelStatementListService'
									}
								}
							},
							'wicitemfk':{
								navigator: {
									moduleName: 'boq.main',
									'navFunc': function (triggerFieldOption, item) {
										let boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
										if(boqRuleComplexLookupService){
											boqRuleComplexLookupService.setNavFromBoqWic();

											$injector.get('boqMainService').setList([]);
											let estimateMainService = $injector.get('estimateMainService');
											if(estimateMainService){
												estimateMainService.updateAndExecute(function() {
													boqRuleComplexLookupService.loadLookupData().then(function ()
													{
														// Remap wic Fks to meet requirements in navigate function
														item.WicBoqItemFk = item.WicItemFk;
														item.WicBoqHeaderFk = item.WicHeaderItemFk;
														triggerFieldOption.NavigatorFrom ='WicBoqItemNavigator';
														$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, item, triggerFieldOption);
													});
												});
											}
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-sel-statement-wic-dialog',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Reference',
											'addGridColumns':[
												{
													id: 'brief',
													field: 'BriefInfo',
													name: 'Description',
													width: 120,
													toolTip: 'Brief',
													formatter: 'translation',
													name$tr$: 'estimate.main.briefInfo'
												}
											]
										}
									},
									field: 'WicItemFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'wicselstatementboqitems',
										displayMember: 'Reference',
										dataServiceName: 'boqWicItemService'
									}
								}
							},
							'wicheaderitemfk':{
								'readonly': true,
								'detail' : {
									model: 'WicItemFk',
									type: 'lookup',
									directive: 'estimate-main-wic-root-item-lookup',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'wicboqheaderitems',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainWicBoqRootItemLookupService'
									}
								},
								'grid': {
									field: 'WicItemFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'wicboqheaderitems',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainWicBoqRootItemLookupService'
									}
								}
							},
							'wiccatfk': {
								'readonly': true,
								'detail' : {
									model: 'WicCatFk',
									type: 'lookup',
									directive: 'estimate-wic-group-lookup',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'WicGroupFk',
										displayMember: 'Code',
										dataServiceName: 'boqWicGroupService'
									}
								},
								'grid': {
									field: 'WicCatFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'WicGroupFk',
										displayMember: 'Code',
										dataServiceName: 'boqWicGroupService'
									}
								}
							},
							'loggingmessage': {
								'readonly': false,
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-sel-statement-logging-dialog'
									},
									formatter: function(row, cell, value, columnDef, entity){
										let parseDate = Date.parse(entity.StartTime);
										if (_.isNaN(parseDate)){
											return '';
										}
										let startDate = $filter('date')(parseDate, 'medium');
										let title = $translate.instant('estimate.main.lineItemSelStatement.report.lastExecutionTime') + ': ' + startDate;
										return '<span title="' + title + '">' + startDate + '</span>';
									},
									'bulkSupport': false
								},
								'detail': {
									'bulkSupport': false
								}
							},
							'psdactivityfk': {
								'navigator': {
									moduleName: 'scheduling.main'
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-activity-dialog',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Code',
											'addGridColumns':[{
												id: 'dec',
												field: 'Description',
												name: 'Description',
												width: 120,
												toolTip: 'Description',
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemactivity',
										displayMember: 'Code',
										dataServiceName: 'estimateMainActivityLookupService'
									}
								}
							},
							'psdheaderactivityfk': {
								'navigator': {
									moduleName: 'scheduling.main'
								},
								'readonly': true,
								'grid': {
									field: 'PsdActivityFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemactivity',
										displayMember: 'Code',
										dataServiceName: 'estimateMainActivityScheduleLookupService'
									}
								}
							},

							// 'mdlmodelfk': {
							//     'navigator': {
							//         moduleName: 'model.main'
							//     },
							//     'grid': {
							//         editor: 'lookup',
							//         editorOptions: {
							//             directive: 'estimate-main-sel-statement-model-dialog',
							//             lookupOptions: {
							//                 'showClearButton': true,
							//                 //'additionalColumns':true,
							//                 'displayMember':'Code',
							//                 // 'addGridColumns':[{
							//                 //     id: 'dec',
							//                 //     field: 'Description',
							//                 //     name: 'Description',d4d807d4047e439d9ba536d7114e9009
							//                 //     width: 120,
							//                 //     toolTip: 'Description',
							//                 //     formatter: 'description',
							//                 //     name$tr$: 'cloud.common.entityDescription'
							//                 // }]
							//             }
							//         },
							//         formatter: 'lookup',
							//         formatterOptions: {
							//             lookupType: 'estlineitemactivity',
							//             displayMember: 'Code',
							//             dataServiceName: 'estimateMainModelLookupService'
							//         }
							//     }
							// },
							'mdlmodelfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estimateMainLineItemSelStatementModelLookupService',
								enableCache: false,
								filter: function (item) {
									function getProjectId(item) {
										let prjId = -1;
										if (item) {
											let projectMainService = $injector.get('projectMainService');
											let projectSelected = projectMainService.getSelected();
											if (projectSelected && projectSelected.Id){
												prjId = projectSelected.Id;
											}
										}
										return prjId;
									}

									return getProjectId(item);
								},
								// filterKey: 'defect-model-by-company-filter'
							})
						}
						
					};
				};

				function navigateToAssembly(triggerFieldOption, entity) {
					triggerFieldOption.ProjectFk = entity.ProjectFk;
					estimateCommonNavigationService.navigateToAssembly(triggerFieldOption, entity);
				}

				let updateTranslationEstLineItemSelStatementLayout = function updateTranslationEstLineItemSelStatementLayout(serviceConainer){
					let listConfig = serviceConainer.getStandardConfigForListView();
					let fieldsToUpdate = [
						{
							id: 'estassemblyfk',
							name$tr$: 'estimate.main.lineItemSelStatement.assemblyCode'
						},
						{
							id: 'estassemblyfkdescription',
							name$tr$: 'estimate.main.lineItemSelStatement.assemblyDescription'
						}
					];

					_.forEach(fieldsToUpdate, function(column){
						let colTranslationToUpdate = _.find(listConfig.columns, { 'id': column.id });
						// eslint-disable-next-line no-prototype-builtins
						if (colTranslationToUpdate && colTranslationToUpdate.hasOwnProperty('id')){
							colTranslationToUpdate.name = $translate.instant(column.name$tr$);
							colTranslationToUpdate.name$tr$ = column.name$tr$;
						}
					});
				};

				let BaseService = platformUIStandardConfigService;
				let estSelStatementDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'EstLineItemSelStatementDto', moduleSubModule: 'Estimate.Main'} );
				if(estSelStatementDomainSchema) {
					estSelStatementDomainSchema = estSelStatementDomainSchema.properties;
				}

				function EstimateSelStatementUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateSelStatementUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateSelStatementUIStandardService.prototype.constructor = EstimateSelStatementUIStandardService;

				let service = new BaseService(getEstLineItemSelStatementDetailLayout(), estSelStatementDomainSchema, estimateMainTranslationService);
				platformUIStandardExtentService.extend(service, getEstLineItemSelStatementDetailLayout().addition, estSelStatementDomainSchema);

				updateTranslationEstLineItemSelStatementLayout(service);

				return service;
			}
		]);
})();
