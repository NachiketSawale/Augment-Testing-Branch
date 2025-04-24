/* global angular */
(function (angular) {
	'use strict';

	function getActionColumns(platformTranslateService) {
		var columns = [
			{
				id: 'id',
				formatter: 'integer',
				field: 'id',
				sortable: true,
				width: 30,
				name: 'ID',
				grouping: {
					title: 'Id',
					getter: 'Id',
					aggregators: [],
					aggregateCollapsed: false
				}

			},
			{
				id: 'description',
				formatter: 'description',
				field: 'code',
				name$tr$: '',
				name: 'code_NT',
				toolTip: 'coden',
				editor: null,
				width: 180,
				sortable: true,
				grouping: {
					title: 'Code',
					title$tr$: 'Code',
					getter: 'Description',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'description',
				formatter: 'description',
				field: 'action.Description',
				name$tr$: '',
				name: 'code_NT',
				toolTip: 'coden',
				editor: null,
				width: 180,
				sortable: true,
				grouping: {
					title: 'Code',
					title$tr$: 'Code',
					getter: 'Description',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'description',
				formatter: 'description',
				field: 'description',
				name$tr$: 'basics.workflow.template.description',
				name: 'description_NT',
				toolTip: 'description',
				editor: null,
				width: 180,
				sortable: true,
				grouping: {
					title: 'Description',
					title$tr$: 'basics.workflow.template.description',
					getter: 'Description',
					aggregators: [],
					aggregateCollapsed: false
				}
			}
		];

		return platformTranslateService.translateGridConfig(columns);
	}

	/* jshint -W072 */
	function basicsWorkflowActionListController($scope, basicsWorkflowBaseGridController,
	                                            platformGridAPI, platformModuleStateService,
	                                            platformTranslateService) {

		platformModuleStateService.state('basics.workflow');
		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			'currentWorkflowAction', 'actionList');

		var columns = getActionColumns(platformTranslateService);
		var gridConfig = {
			data: [],
			columns: columns,
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'id',
				iconClass: '',
				enableDraggableGroupBy: true,
				grouping: true
			}
		};
		$scope.configGrid(gridConfig);
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
						value: _.isObject(platformGridAPI.filters.showSearch($scope.gridId)) ? true : platformGridAPI.filters.showSearch($scope.gridId),
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
						id: 't16',
						sort: 10,
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						fn: function () {
							platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value);
						},
						value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
						disabled: false
					}
				]
			});
	}

	angular.module('basics.workflow').controller('basicsWorkflowActionListController',
		['$scope', 'basicsWorkflowBaseGridController',
			'platformGridAPI', 'platformModuleStateService',
			'platformTranslateService',
			basicsWorkflowActionListController]);

})(angular);
