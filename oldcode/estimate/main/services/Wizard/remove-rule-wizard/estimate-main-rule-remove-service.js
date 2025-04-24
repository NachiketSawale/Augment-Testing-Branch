(function () {
	/* global _ globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainRuleRemoveService', ['$injector', '$q', '$http', 'platformSchemaService', '$translate', 'platformTranslateService',
		'platformModalService', 'platformRuntimeDataService', 'platformDataValidationService', 'cloudDesktopSidebarService', 'qtoHeaderReadOnlyProcessor',
		'platformUserInfoService', 'basicsClerkUtilitiesService', 'platformContextService', 'estimateMainService', 'estimateMainRootService',
		function ($injector, $q, $http, platformSchemaService, $translate, platformTranslateService,
			platformModalService, runtimeDataService, platformDataValidationService, cloudDesktopSidebarService, readOnlyProcessor,
			platformUserInfoService, basicsClerkUtilitiesService, platformContextService, estimateMainService, estimateMainRootService) {

			let service = {};

			let self = service;

			const leadingStructures = {
				'EstActivity': 'estimateMainActivityService',
				'EstAssemblyCat': 'estimateMainAssembliesCategoryService',
				'EstBoq': 'estimateMainBoqService',
				'EstCtu': 'estimateMainControllingService',
				'EstPrjLocation': 'estimateMainLocationService',
				'EstPrcStructure': 'estimateMainProcurementStructureService',
				'EstCostGrp': 'costGroupStructureDataServiceFactory'
			};

			service.dataItem = {SelectedLevel: 'SelectedItems', SelectedRules: [], LeadingStructure: false,IsRemoveRuleParam:false, Root: true,SelectedParams:[]};

			service.formConfiguration = {
				fid: 'estimate.main.removeEstimateRuleAssignments',
				version: '0.1.1',
				showGrouping: true,
				groups: [
					{
						gid: 'assignedLevel',
						header: 'Assigned Level',
						header$tr$: 'estimate.rule.removeEstimateRulesWizard.groupTitle1',
						visible: true,
						isOpen: true,
						attributes: [],
						sortOrder:1
					},{
						gid: 'leadStructure',
						header: 'Additional Options',
						header$tr$: 'estimate.rule.removeEstimateRulesWizard.groupTitle3',
						visible: true,
						isOpen: true,
						attributes: [],
						sortOrder:2
					},{
						gid: 'searchRules',
						header: 'Search Rules',
						header$tr$: 'estimate.rule.removeEstimateRulesWizard.groupTitle2',
						visible: true,
						isOpen: true,
						attributes: [],
						sortOrder:3
					},{
						gid: 'paramStructure',
						header: 'Select Parameters',
						header$tr$: 'estimate.main.selectParametersGroupTitle',
						visible:false,
						isOpen: true,
						attributes: [],
						sortOrder:4
					}
				],
				rows: [
					{
						gid: 'assignedLevel',
						rid: 'selectedItem',
						label: 'Select Estimate Scope',
						label$tr$: 'estimate.main.removeRulesFrm',
						type: 'radio',
						model: 'SelectedLevel',
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'removeEstimateRulesConfig',
							items: [
								{
									Id: 1,
									Description: $translate.instant('estimate.main.splitLineItemWizard.selectedItems'),
									Value: 'SelectedItems'
								},
								{
									Id: 2,
									Description: $translate.instant('estimate.main.currentResultSet'),
									Value: 'ResultSet'
								},
								{
									Id: 3,
									Description: $translate.instant('estimate.main.splitLineItemWizard.entireEstimate'),
									Value: 'EntireEstimate'
								}
							]
						},
						sortOrder: 1
					},{
						rid: 'leadingStructure',
						gid: 'leadStructure',
						label: 'Remove Rules from Leading Structure',
						label$tr$: 'estimate.main.leadingStructureTitle2',
						type: 'boolean',
						model: 'LeadingStructure',
						sortOrder: 2
					},{
						rid: 'root',
						gid: 'leadStructure',
						label: 'Remove Rules from Root Assignment',
						label$tr$: 'estimate.main.rootTitle2',
						type: 'boolean',
						model: 'Root',
						sortOrder: 3
					},{
						rid: 'root',
						gid: 'leadStructure',
						label: 'Remove Parameters with Rules',
						label$tr$: 'estimate.main.removeRuleParamTitle',
						type: 'boolean',
						model: 'IsRemoveRuleParam',
						sortOrder: 4
					},{
						gid: 'searchRules',
						rid: 'searchRule',
						type: 'directive',
						model: 'SelectedRules',
						required: true,
						'directive': 'estimate-Remove-Rule-Wizard-Generate-Grid',
						sortOrder: 5
					},{
						gid: 'paramStructure',
						rid: 'selectParams',
						type: 'directive',
						model: 'SelectParams',
						'directive': 'estimate-main-param-removal-grid',
						sortOrder: 6
					}
				]
			};

			service.removeEstimateRuleAssignments = function removeEstimateRuleAssignments(result) {

				let estLineItemsIds =[];
				if(result.data.SelectedLevel ==='ResultSet'){
					estLineItemsIds = _.map(estimateMainService.getList(),'Id');
				}else if(result.data.SelectedLevel ==='SelectedItems'){
					estLineItemsIds = _.map(estimateMainService.getSelectedEntities(),'Id');
				}

				let postData = {
					'ProjectId': estimateMainService.getSelectedProjectId(),
					'EstHeaderFk': parseInt(estimateMainService.getSelectedEstHeaderId()),
					'LineItemsSelectedLevel': result.data.SelectedLevel,
					'SelectedEstLineItemIds': estLineItemsIds,
					'PrjEstRules': result.data.SelectedRules,
					'IsLeadingStructure': result.data.LeadingStructure,
					'SelectedParams':result.data.SelectedParams?result.data.SelectedParams:[],
					'IsRoot': result.data.Root,
					'IsRemoveRuleParam':result.data.IsRemoveRuleParam,
					'StructureId':0
				};

				if (postData.ProjectId > 0 && postData.EstHeaderFk>0 ) {
					$http.post (globals.webApiBaseUrl + 'estimate/main/lineitem/deleteruleassignments', postData)
						.then (function (/* response */) {
							estimateMainService.load();
							refreshGridsAfterRuleDelete(postData);
						}, function () {

						});
				}
			};

			function refreshGridsAfterRuleDelete(postData){
				if(angular.isArray(postData.PrjEstRules) && postData.PrjEstRules.length){
					const prjRuleIds = _.map(postData.PrjEstRules,'Id');
					if(postData.IsRoot){
						$injector.get('estimateRuleFormatterService').removeRulesByPrjRuleIds('EstHeader', prjRuleIds);
						estimateMainRootService.load();
					}
					if(postData.IsLeadingStructure){
						for (const key in leadingStructures) {
							if (leadingStructures.hasOwnProperty(key)) {
								const removeRuleResult = $injector.get('estimateRuleFormatterService').removeRulesByPrjRuleIds(key, prjRuleIds);
								if(removeRuleResult && removeRuleResult.isSuccess){
									const leadingStructureService = $injector.get(leadingStructures[key]);
									//remove the rules from the leading structure
									const leadingStructureItems = leadingStructureService.getList();
									if(leadingStructureItems && angular.isArray(leadingStructureItems) && leadingStructureItems.length){
										_.forEach(leadingStructureItems, function (leadingStructureItem) {
											if(leadingStructureItem.Rule && angular.isArray(leadingStructureItem.Rule) && leadingStructureItem.Rule.length){
												leadingStructureItem.Rule = leadingStructureItem.Rule.filter(e => !removeRuleResult.ruleCodes.includes(e));
											}
										});
									}
									//refresh
									if(leadingStructureService.gridRefresh){
										leadingStructureService.gridRefresh();
									}
								}
							}
						}
					}
				}
			}

			function init(){
				service.dataItem = {SelectedLevel: 'SelectedItems', SelectedRules: [], LeadingStructure: false,IsRemoveRuleParam:false, Root: true,SelectedParams:[]};
			}

			self.showCreateDialog = function showCreateDialog() {
				init();
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-rule-assign-remove-dialog.html',
					backdrop: false,
					width: 800,
					resizeable: true

				}).then(function (result) {
					if (result && result.ok && result.data) {
						service.removeEstimateRuleAssignments(result);
					}
				}
				);
			};

			service.showDialog = function showDialog(/* value */) {
				platformTranslateService.translateFormConfig(self.formConfiguration);
				self.showCreateDialog();
			};

			service.getDialogTitle = function getDialogTitle() {
				return $translate.instant('estimate.main.removeEstimateRuleAssignments');
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return '';
					}, enumerable: true
				}
			}
			);

			service.getDataItem = function getDataItem() {
				return service.dataItem;
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return service.formConfiguration;
			};

			return service;
		}]);

})(angular);
