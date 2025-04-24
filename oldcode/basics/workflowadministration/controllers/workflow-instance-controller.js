/* global angular */
(function () {
	'use strict';

	function getWorkflowInstanceColumns(domainService, basicsWorkflowUIService) {

		var columns = [
			{
				id: 'id',
				formatter: 'integer',
				field: 'Id',
				name: 'ID',
				name$tr$: 'cloud.common.entityId',
				sortable: true,
				grouping: {
					title: 'ID',
					getter: 'Id',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'description',
				formatter: 'description',
				field: 'Description',
				name: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				sortable: true,
				grouping: {
					title: 'Description',
					title$tr$: 'cloud.common.entityDescription',
					getter: 'Description',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'statusName',
				formatter: 'description',
				field: 'StatusName',
				name: 'Status',
				sortable: true,
				name$tr$: 'cloud.common.entityStatus',
				grouping: {
					title: 'Status',
					title$tr$: 'cloud.common.entityStatus',
					getter: 'StatusName',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'workflowTemplatVersionId',
				formatter: 'integer',
				field: 'TemplateVersion.TemplateVersion',
				name: 'Template Version',
				name$tr$: 'basics.workflowAdministration.instance.templateVersion',
				sortable: true,
				grouping: {
					title: 'Template Version',
					title$tr$: 'basics.workflowAdministration.instance.templateVersion',
					getter: 'Version',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'moduleName',
				formatter: 'description',
				field: 'ModuleName',
				name: 'Module Name',
				name$tr$: 'basics.workflowAdministration.instance.moduleName',
				sortable: true,
				minWidth: 50,
				grouping: {
					title: 'Module Name',
					title$tr$: 'basics.workflowAdministration.instance.moduleName',
					getter: 'ModuleName',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'clerkName',
				formatter: 'description',
				field: 'ClerkName',
				name: 'Clerk',
				name$tr$: 'basics.workflowAdministration.common.clerk',
				sortable: true,
				minWidth: 50,
				grouping: {
					title: 'Clerk',
					title$tr$: 'basics.workflowAdministration.common.clerk',
					getter: 'ClerkName',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'companyName',
				formatter: 'description',
				field: 'CompanyName',
				name: 'Company',
				name$tr$: 'basics.workflowAdministration.instance.company',
				sortable: true,
				minWidth: 50,
				navigator: {
					moduleName: '',
					targetIdProperty: 'Id'
				},
				grouping: {
					title: 'Company',
					title$tr$: 'basics.workflowAdministration.instance.company',
					getter: 'CompanyName',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'projectName',
				formatter: 'description',
				field: 'ProjectName',
				name: 'Project',
				name$tr$: 'basics.workflowAdministration.instance.project',
				sortable: true,
				minWidth: 50,
				grouping: {
					title: 'Project',
					title$tr$: 'basics.workflowAdministration.instance.project',
					getter: 'ProjectName',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'entityId',
				formatter: function (row, cell, value, columnDef, dataContext) {
					if (dataContext.ModuleName) {
						columnDef.navigator = {
							moduleName: dataContext.ModuleName,
							targetIdProperty: 'Id'
						};

						var button = domainService.getNavigator(columnDef, {
							Id: dataContext.EntityId,
							EntityId: dataContext.EntityId
						});

						return dataContext.EntityId + button;
					}
					return dataContext.EntityId;
				},
				field: 'EntityId',
				name: 'Entity Id',
				name$tr$: 'basics.workflowAdministration.instance.entity',
				sortable: true,
				minWidth: 50,
				grouping: {
					title: 'Entity Id',
					title$tr$: 'basics.workflowAdministration.instance.entity',
					getter: 'EntityId',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'Endtime',
				formatter: 'datetime',
				field: 'Endtime',
				name: 'End Time',
				name$tr$: 'basics.workflowAdministration.common.endTime',
				sortable: true,
				grouping: {
					title: 'End Time',
					title$tr$: 'basics.workflowAdministration.common.endTime',
					getter: 'Endtime',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'Duration',
				formatter: 'description',
				field: 'Duration',
				name: 'Duration',
				name$tr$: 'basics.workflowAdministration.commen.duration',
				sortable: true,
				minWidth: 100,
				grouping: {
					title: 'Duration',
					title$tr$: 'basics.workflowAdministration.commen.duration',
					getter: 'Duration',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
		];

		basicsWorkflowUIService.addHistoryFields(columns);

		return columns;
	}

	function basicsWorkflowAdministrationInstanceController($scope, basicsWorkflowBaseGridController, platformGridAPI,
		platformTranslateService, basicsWorkflowAdministrationInstanceService,
		platformModuleStateService, platformGridDomainService, basicsWorkflowUIService, basicsWorkflowModuleUtilService, platformModalService) {
		var state = platformModuleStateService.state('basics.workflowAdministration');
		var columns = getWorkflowInstanceColumns(platformGridDomainService, basicsWorkflowUIService);

		//Setting standard grid configuration
		var gridConfig = {
			data: [],
			columns: columns,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'Id',
				iconClass: '',
				enableDraggableGroupBy: true
			}
		};

		if ($scope.getContentValue('containerType') === 'tree') {
			//Setting selected tree item as main entity
			basicsWorkflowBaseGridController.extend($scope, 'basics.workflowAdministration', 'selectedMainEntityTree', 'mainEntitiesTrees', {
				isParentSelected: function () {
					return state.selectedMainEntityTree;
				},
				listener: function (newVal, oldVal) {
					state.selectedMainEntity = newVal;
				}
			});

			//Setting tree configuration for grid
			gridConfig = {
				...gridConfig,
				id: $scope.gridId,
				options: {
					...gridConfig.options,
					tree: true,
					collapsed: true,
					idProperty: 'Id',
					enableDraggableGroupBy: false,
					parentProp: 'CallingInstance',
					childProp: 'Children',
				}
			}


		} else {
			basicsWorkflowBaseGridController.extend($scope, 'basics.workflowAdministration', 'selectedMainEntity', 'mainEntities');
			gridConfig = {
				...gridConfig,
				id: $scope.gridId,
			}
		}

		platformTranslateService.translateGridConfig(gridConfig);

		$scope.configGrid(gridConfig);

		var toolbarItems = [
			{
				id: 't4',
				caption: 'cloud.common.toolbarSearch',
				type: 'check',
				iconClass: 'tlb-icons ico-search',
				value: _.isObject(platformGridAPI.filters.showSearch($scope.gridId)) ? true : platformGridAPI.filters.showSearch($scope.gridId),				//Defect #111665
				fn: function () {
					platformGridAPI.filters.showSearch($scope.gridId, this.value);
				}
			},
			{
				id: 't5',
				caption: 'cloud.common.toolbarDeleteSearch',
				type: 'item',
				iconClass: 'tlb-icons ico-search-delete',
				fn: function () {
					platformGridAPI.filters.showSearch($scope.gridId, false);
				}
			},
			{
				id: 't15',
				caption: 'cloud.common.documentProperties',
				type: 'item',
				iconClass: 'tlb-icons ico-settings',
				fn: function () {
					$scope.showGridLayoutConfigDialog();
				}
			},
			{
				id: 't12',
				sort: 10,
				caption: 'cloud.common.taskBarGrouping',
				type: 'check',
				iconClass: 'tlb-icons ico-group-columns',
				fn: function () {
					platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value);
				},
				value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
				disabled: false
			},
			{
				id: 't13',
				sort: 11,
				caption: 'basics.workflowAdministration.instance.escalate',
				type: 'item',
				iconClass: 'tlb-icons ico-active-directory-import',
				fn: function () {
					basicsWorkflowAdministrationInstanceService.escalateWorkflow(state.selectedMainEntity.Id);
				},
				disabled: disabledFn,
			},
			{
				id: 't14',
				sort: 12,
				caption: 'basics.workflowAdministration.instance.kill',
				type: 'item',
				iconClass: 'tlb-icons ico-workflow-cancel',
				fn: function () {
					killInstances();
				},
				disabled: disabledFn,
			},
			{
				id: 'collapseall',
				sort: 80,
				caption: 'cloud.common.toolbarCollapseAll',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-collapse-all',
				fn: function collapseAll() {
					platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
				}
			},
			{
				id: 'expandall',
				sort: 90,
				caption: 'cloud.common.toolbarExpandAll',
				type: 'item',
				iconClass: 'tlb-icons ico-tree-expand-all',
				fn: function expandAll() {
					platformGridAPI.rows.expandAllSubNodes($scope.gridId);
				}
			}
		];

		if ($scope.getContentValue('containerType') === 'tree') {
			//Filtering out grouping button for tree configuration
			toolbarItems = toolbarItems.filter(tool => tool.id !== 't12');
		}

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems
			});

		var disabledFn = function () {
			var disabled = false;
			if (!state.selectedMainEntity || _.isEmpty(state.selectedMainEntity)) {
				disabled = true;
			}

			return disabled;
		};

		$scope.$watch(function () {
			return state.selectedMainEntity;
		}, function () {
			$scope.tools.refresh();
		});

		function killInstances() {
			var instanceIdList = basicsWorkflowModuleUtilService.getCurrentOrSelectedItem(state.selectedMainEntity);         //An array of the instance Ids.
			platformModalService.showYesNoDialog('basics.workflowAdministration.instance.confirmKill', 'basics.workflowAdministration.instance.headerKill', 'no')
				.then(function (response) {
					if (response.yes) {
						basicsWorkflowAdministrationInstanceService.killWorkflowOrInBulk(instanceIdList);
					}
				});
		}

	}

	angular.module('basics.workflowAdministration').controller('basicsWorkflowAdministrationInstanceController',
		['$scope', 'basicsWorkflowBaseGridController', 'platformGridAPI',
			'platformTranslateService', 'basicsWorkflowAdministrationInstanceService',
			'platformModuleStateService', 'platformGridDomainService', 'basicsWorkflowUIService', 'basicsWorkflowModuleUtilService', 'platformModalService', basicsWorkflowAdministrationInstanceController]);
})();