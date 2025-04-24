/**
 * Created by mov on 7/28/2016.
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainOutputUIStandardService
	 * @function
	 *
	 * @description
	 * UI Service for the estimate main rule script output container
	 **/
	angular.module(moduleName).factory('estimateMainOutputUIStandardService', [
		'$filter', '$timeout', '$translate', '$injector', 'platformTranslateService', 'platformModuleNavigationService','platformPermissionService',
		function ($filter, $timeout, $translate, $injector, platformTranslateService, naviService,platformPermissionService) {

			let service = {};
			let gridId = '8989297c1ce24515a2f81521bda937c7';

			let gridColumns = [
				{
					id: 'order',
					field: 'Order',
					name: '#',
					toolTip: 'Order',
					sortable: true,
					// formatter: 'code',
					searchable: true,
					navigator: {
						moduleName: $translate.instant(moduleName +  '.ruleExecutionOutput.ruleScript'),
						navFunc: function (item, triggerField) {
							let navigator = naviService.getNavigator('project.main-estimate-rule-script');
							let projectMainService = $injector.get('projectMainService');

							if (_.isEmpty(projectMainService.getList())) {
								loadProjectMainService(projectMainService, item, triggerField, navigator);
							} else {
								if (projectMainService.getSelected() && projectMainService.getSelected().Id === $injector.get('estimateMainService').getSelectedProjectId()) {
									angular.extend(triggerField, { Code: triggerField.ruleCode, ReloadScript: true });
									naviService.navigate(navigator, item, triggerField);
								} else {
									$injector.get('estimateProjectEstRuleScriptService').clear();
									projectMainService.clearCache();
									loadProjectMainService(projectMainService, item, triggerField, navigator);
								}
							}
						}
					},
					formatter: function (row, cell, value, columnDef, entity) {
						let result = value ? value :entity[columnDef.field];
						if(!platformPermissionService.hasCreate(gridId) || !platformPermissionService.hasWrite(gridId) || !platformPermissionService.hasDelete(gridId)){
							return  result;
						}
						return result + $injector.get('platformGridDomainService').getNavigator(columnDef, entity);
					}
				},
				{
					id: 'category',
					field: 'ErrorType',
					name$tr$: moduleName +  '.ruleExecutionOutput.category',
					sortable: false,
					formatter: function(row, cell, value){
						return '<i class="block-image ' + $filter('estimateMainScriptErrorTypeFilter')(value) + '"></i>';
					}
				},
				{
					id: 'lineItemCode',
					field: 'lineItemCode',
					name$tr$: moduleName +  '.ruleExecutionOutput.generateItemCode',
					formatter: 'code',
					sortable: true,
					searchable: true,
					grouping: {
						title:  moduleName +  '.ruleExecutionOutput.generateItemCode',
						getter: 'lineItemCode',
						aggregators: [],
						aggregateCollapsed: true
					},
					width: 150
				},
				{
					id: 'ruleCode',
					field: 'ruleCode',
					name$tr$: moduleName + '.ruleExecutionOutput.ruleCode',
					formatter: 'code',
					searchable: true,
					grouping: {
						title: moduleName + '.ruleExecutionOutput.ruleCode',
						getter: 'ruleCode',
						aggregators: [],
						aggregateCollapsed: true
					},
					sortable: true
				},
				{
					id: 'description',
					field: 'Description',
					name$tr$: moduleName + '.ruleExecutionOutput.description',
					sortable: true,
					searchable: true,
					width: 300,
					editor: 'lookup',
					editorOptions: {
						directive: 'construction-System-Common-stack-trace-Dialog',
						lookupOptions: {
							showClearButton: false
						}
					}
				},
				{
					id: 'elementCode',
					field: 'ElementCode',
					name$tr$: moduleName + '.ruleExecutionOutput.elementCode',
					formatter: 'code',
					sortable: true,
					searchable: true,
					grouping: {
						title: moduleName + '.ruleExecutionOutput.elementCode',
						getter: 'ElementCode',
						aggregators: [],
						aggregateCollapsed: true
					},
					width: 300
				},
				{
					id: 'assignedStructureType',
					field: 'AssignedStructureType',
					name$tr$: moduleName + '.assignedStructureType',
					formatter: 'code',
					sortable: true,
					searchable: true,
					grouping: {
						title: moduleName + '.assignedStructureType',
						getter: 'AssignedStructureType',
						aggregators: [],
						aggregateCollapsed: true
					},
					width: 300
				},
				{
					id: 'line',
					field: 'Line',
					name$tr$: moduleName + '.ruleExecutionOutput.line',
					sortable: true,
					domain: 'description',
					searchable: true
				},
				{
					id: 'column',
					field: 'Column',
					name$tr$: moduleName + '.ruleExecutionOutput.column',
					sortable: true,
					domain: 'description',
					searchable: true
				},
				{
					id: 'callStack',
					field: 'CallStack',
					name$tr$: moduleName + '.ruleExecutionOutput.callStack',
					sortable: true,
					searchable: true,
					editor: 'lookup',
					editorOptions: {
						directive: 'construction-System-Common-stack-trace-Dialog',
						lookupOptions: {
							showClearButton: false
						}
					}
				}
			];

			platformTranslateService.translateGridConfig(gridColumns);

			angular.extend(service, {
				getStandardConfigForListView : getStandardConfigForListView
			});

			return service;

			function getStandardConfigForListView() {
				return{
					columns : gridColumns
				};
			}

			function loadProjectMainService(projectMainService, item, triggerField){
				projectMainService.deselect();
				projectMainService.load().then(function(){
					let projectToSelect = projectMainService.getItemById($injector.get('estimateMainService').getSelectedProjectId());
					projectMainService.setSelected(projectToSelect);
					$timeout(function(){
						navigateToProjectRuleScript(item, triggerField, true);
					}, 251);
				});
			}

			function navigateToProjectRuleScript(item, triggerField, reloadScript){
				angular.extend(triggerField, { Code: triggerField.ruleCode, ReloadScript: reloadScript });
				let navigator = naviService.getNavigator('project.main-estimate-rule-script');
				naviService.navigate(navigator, item, triggerField);
			}
		}]);
})();
