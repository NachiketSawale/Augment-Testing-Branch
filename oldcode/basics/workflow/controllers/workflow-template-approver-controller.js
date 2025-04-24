/* global angular */
(function (angular) {
	'use strict';

	function getActionColumns(platformTranslateService, basicsWorkflowApproverUiService) {
		var columns = _.cloneDeep(basicsWorkflowApproverUiService.getStandardConfigForListView().columns);

		return platformTranslateService.translateGridConfig(columns);
	}

	/* jshint -W072 */
	function basicsWorkflowApproverController($scope, basicsWorkflowBaseGridController,
	                                          platformGridAPI, platformModuleStateService,
	                                          platformTranslateService, $timeout, platformRuntimeDataService, basicsWorkflowApproverConfigUiService, basicsWorkflowTemplateService) {

		platformModuleStateService.state('basics.workflow');

		var state = platformModuleStateService.state('basics.workflow');
		$scope.state = state;

		$scope.missingParentText = 'basics.workflow.approver.selectedApproverConfigMissing';

		function itemsListWatchExpression() {
			return state.selectedMainEntity && state.selectedMainEntity.ApproverList;
		}

		function currentItemListener(newVal, oldVal) {
			if (newVal && oldVal && newVal.Id !== oldVal.Id) {
				state.selectedApprover = newVal;
			}
		}

		function currentItemWatchExpression() {
			return state.selectedApprover;
		}

		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			{
				expression: currentItemWatchExpression,
				listener: currentItemListener,
				name: 'selectedApprover'
			},
			{
				expression: itemsListWatchExpression,
				listener: _.noop,
				name: 'ApproverList'
			},
			{
				isParentSelected: function () {
					return state.selectedApproverConfig;
				},
				listener: function (newVal, oldVal) {
					if (newVal !== oldVal) {
						$scope.gridVisible = _.isObject(newVal) && newVal.Id;
						$scope.tools.update();
						updateGridItems();

						$timeout(function () {
							$scope.refreshGrid();
							$scope.resizeGrid();
						});
					}
				}
			});

		var columns = getActionColumns(platformTranslateService, basicsWorkflowApproverConfigUiService);

		function updateGridItems() {
			if (state.selectedApproverConfig && _.isArray(state.selectedApproverConfig.ApproverList)) {
				platformGridAPI.items.data($scope.gridId, _.filter(state.selectedApproverConfig.ApproverList, function (config) {
					return !config.IsDeleted;
				}));
			} else {
				platformGridAPI.items.data($scope.gridId, []);
			}
		}

		$scope.$watch(
			function () {
				return state.selectedApprover;
			}, function () {
				$scope.tools.update();
			});

		var gridConfig = {
			data: state.selectedApproverConfig && state.selectedApproverConfig.ApproverList ? state.selectedApproverConfig.ApproverList : [],
			columns: columns,
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'Id',
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
						id: 'wfSearch',
						caption: 'cloud.common.toolbarSearch',
						type: 'check',
						value: _.isObject(platformGridAPI.filters.showSearch($scope.gridId)) ? true : platformGridAPI.filters.showSearch($scope.gridId),
						iconClass: 'tlb-icons ico-search',
						fn: function () {
							platformGridAPI.filters.showSearch($scope.gridId, this.value);
						}
					},
					{
						id: 'wfGridprops',
						caption: 'cloud.common.documentProperties',
						type: 'item',
						iconClass: 'tlb-icons ico-settings',
						fn: function () {
							$scope.showGridLayoutConfigDialog();
						}
					},
					{
						id: 'wfgrouping',
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
						id: 'wfInsert',
						caption: 'cloud.common.toolbarInsert',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						disabled: function () {
							return !state.selectedMainEntity || !state.selectedMainEntity.Id;
						},
						fn: function () {
							basicsWorkflowTemplateService.createApprover(state.selectedApproverConfig.Id).then(function () {
								updateGridItems();
							});
						}
					},
					{
						id: 'wfDelete',
						caption: 'cloud.common.toolbarDelete',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						get disabled() {
							return !state.selectedApproverConfig || !state.selectedApprover;
						},
						fn: function () {
							state.mainItemIsDirty = true;
							state.selectedApprover.IsDeleted = true;
							updateGridItems();
						}
					}
				]
			});
	}

	angular.module('basics.workflow').controller('basicsWorkflowApproverController',
		['$scope', 'basicsWorkflowBaseGridController',
			'platformGridAPI', 'platformModuleStateService',
			'platformTranslateService', '$timeout', 'platformRuntimeDataService', 'basicsWorkflowApproverUiService', 'basicsWorkflowTemplateService',
			basicsWorkflowApproverController]);

})(angular);
