/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateProjectLineItemSelStatementConfigurationService
	 * @function
	 * @description
	 * This is the data service for project MainLineItemSelStatementConfigurationService data functions.
	 */
	angular.module(moduleName).factory('estimateProjectLineItemSelStatementConfigurationService',
		['$injector', '$translate', '$filter', 'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformUIStandardExtentService', 'platformSchemaService', 'estimateMainSelStatementFilterEditorTranslateService',

			function ($injector, $translate, $filter, platformUIStandardConfigService, estimateMainTranslationService, platformUIStandardExtentService, platformSchemaService, estimateMainSelStatementFilterEditorTranslateService) {

				let getEstLineItemSelStatementDetailLayout = function getEstLineItemSelStatementDetailLayout() {
					return {
						'fid': 'project.main.lineItem.selection.statement',
						'version': '1.0.1',
						'showGrouping': false,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes':  ['code', 'descriptioninfo',  'estassemblyfk', 'boqitemfk', 'wicitemfk','wiccatfk','wicheaderitemfk', 'selectstatement']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
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
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-common-translate-cell',
										'dataService': 'estimateProjectEstimateLineItemSelStatementListService',
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
							'estassemblyfk': {
								navigator: {
									moduleName: 'estimate.assemblies'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-assembly-template-lookup',
										lookupOptions: {
											usageContext: 'estimateProjectEstimateLineItemSelStatementListService',
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
								'navigator': {
									moduleName: 'boq.main',
									'navFunc': function (triggerFieldOption, item) {
										let boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
										if(boqRuleComplexLookupService){
											boqRuleComplexLookupService.setNavFromBoqProject();

											let estimateMainService = $injector.get('estimateMainService');
											if(estimateMainService){
												estimateMainService.updateAndExecute(function() {
													let projectId = estimateMainService.getSelectedProjectId();
													boqRuleComplexLookupService.setProjectId(projectId);
													boqRuleComplexLookupService.loadLookupData().then(function ()
													{
														triggerFieldOption.NavigatorFrom ='EstBoqItemNavigator';
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
										directive: 'estimate-main-sel-statement-boq-dialog',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Reference',
											'addGridColumns':[
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
										lookupType: 'estselstatementboqitems',
										displayMember: 'Reference',
										dataServiceName: 'estimateMainBoqLookupService'
									}
								}
							},
							'wicitemfk':{
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
							}
						},
						'addition':{
							grid: [
								{
									'afterId': 'boqitemfk',
									'id': 'boqrootref',
									'field': 'BoqItemFk',
									'name': 'BoQ Root Item Ref.No.',
									'name$tr$': 'estimate.main.boqRootRef',
									'sortable': true,
									'readonly': true,
									'directive': 'estimate-main-root-boq-item',
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'estboqitems',
										'displayMember': 'Reference',
										dataServiceName: 'estimateMainBoqRootLookupService'
									},
									'width': 140
								}
							]
						}
					};
				};

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
