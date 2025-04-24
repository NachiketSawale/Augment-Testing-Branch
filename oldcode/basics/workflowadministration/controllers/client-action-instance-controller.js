/* globals angular */
(function (angular) {
	'use strict';
	var moduleName = 'basics.workflowAdministration';

	function getColumns() {
		return [
			{
				id: 'id',
				formatter: 'integer',
				field: 'Id',
				name: 'ID',
				name$tr$: 'cloud.common.entityId',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'ID',
					title$tr$: 'cloud.common.entityId',
					getter: 'Id',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'description',
				formatter: 'description',
				field: 'Description',
				name: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Description',
					title$tr$: 'cloud.common.entityDescription',
					getter: 'Description',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'comment',
				formatter: 'comment',
				field: 'Comment',
				name: 'Comment',
				name$tr$: 'cloud.common.entityComment',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Comment',
					title$tr$: 'cloud.common.entityComment',
					getter: 'Comment',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'started',
				formatter: 'datetime',
				field: 'Started',
				name: 'Started',
				name$tr$: 'basics.workflowAdministration.commen.startTime',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Started',
					title$tr$: 'basics.workflowAdministration.commen.startTime',
					getter: 'Started',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'MaxEndTime',
				formatter: 'datetime',
				field: 'MaxEndtime',
				name: 'MaxEndTime',
				name$tr$: 'basics.workflowAdministration.commen.maxEndTime',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'MaxEndTime',
					title$tr$: 'basics.workflowAdministration.commen.endTime',
					getter: 'MaxEndtime',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Endtime',
				formatter: 'datetime',
				field: 'Endtime',
				name: 'Endtime',
				name$tr$: 'basics.workflowAdministration.commen.endTime',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Endtime',
					title$tr$: 'basics.workflowAdministration.commen.endTime',
					getter: 'Endtime',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Duration',
				formatter: 'description',
				field: 'Duration',
				name: 'Duration',
				name$tr$: 'basics.workflowAdministration.commen.duration',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Duration',
					title$tr$: 'basics.workflowAdministration.commen.duration',
					getter: 'Duration',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'isRunning',
				formatter: 'boolean',
				field: 'IsRunning',
				name: 'Running',
				name$tr$: 'basics.workflowAdministration.action.isRunning',
				sortable: true,
				minWidth: 50,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Running',
					title$tr$: 'basics.workflowAdministration.action.isRunning',
					getter: 'IsRunning',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				directive: 'basics-lookupdata-lookup-composite',
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'cloud-clerk-clerk-dialog',
					lookupOptions: {
						showClearButton: true
					}
				},
				field: 'OwnerId',
				formatter: 'lookup',
				formatterOptions: {
					displayMember: 'Description',
					lookupType: 'Clerk'
				},
				id: 'OwnerId',
				name: 'Key User',
				name$tr$: 'basics.workflowAdministration.commen.clerk',
				sortable: true,
				grouping: {
					title: 'Key User',
					title$tr$: 'basics.workflowAdministration.commen.clerk',
					getter: 'OwnerId',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				field: 'ProgressById',
				formatter: 'lookup',
				formatterOptions: {
					displayMember: 'Description',
					lookupType: 'Clerk'
				},
				id: 'ProgressById',
				name: 'Progressed by',
				name$tr$: 'basics.workflowAdministration.clientActionclientAction.progressedBy',
				sortable: true,
				grouping: {
					title: 'Progressed by',
					//title$tr$: 'basics.workflowAdministration.commen.clerk',
					getter: 'ProgressById',
					aggregators: [],
					aggregateCollapsed: false
				}
			}

		];
	}

	function ctrl($scope, basicsWorkflowBaseGridController, platformTranslateService, platformModuleStateService,
		basicsWorkflowAdministrationInstanceService, platformGridAPI, basicsWorkflowInstanceService) {
		var state = platformModuleStateService.state(moduleName);

		basicsWorkflowBaseGridController.extend($scope, moduleName,
			'selectedClientActionInstance', 'clientActionInstances');

		var columns = getColumns();

		var gridConfig = {
			data: [],
			columns: columns,
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'Id',
				iconClass: '',
				enableDraggableGroupBy: true
			}
		};

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't4',
						caption: 'cloud.common.toolbarSearch',
						type: 'check',
						iconClass: 'tlb-icons ico-search',
						fn: function () {
							platformGridAPI.filters.showSearch($scope.gridId, this.value);
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
						caption: 'cloud.desktop.navBarRefreshDesc',
						type: 'item',
						iconClass: 'tlb-icons ico-refresh',
						fn: function () {
							basicsWorkflowAdministrationInstanceService.clientActionInstancList().then(function (clientActions) {
								state.clientActionInstances = clientActions;
							});
						},
						disabled: false
					},
					{
						id: 't13',
						sort: 11,
						caption: '',
						type: 'item',
						iconClass: 'tlb-icons ico-filter-cal-01',
						fn: function () {
							basicsWorkflowAdministrationInstanceService.clientOverdueActionInstancList().then(function (clientActions) {
								state.clientActionInstances = clientActions;
							});
						},
						disabled: false
					}
				]
			});

		platformTranslateService.translateGridConfig(gridConfig);
		$scope.configGrid(gridConfig);
		basicsWorkflowBaseGridController.gridAPI.events.register($scope.gridId, 'onCellChange', function (e, data) {
			basicsWorkflowInstanceService.changeUser(data.item.Id, data.item.OwnerId);
		});

	}

	ctrl.$inject = ['$scope', 'basicsWorkflowBaseGridController', 'platformTranslateService', 'platformModuleStateService',
		'basicsWorkflowAdministrationInstanceService', 'platformGridAPI', 'basicsWorkflowInstanceService'];

	angular.module(moduleName)
		.controller('basicsWorkflowClientActionInstanceController', ctrl);
})(angular);