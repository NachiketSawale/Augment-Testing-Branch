/* global angular */
(function (angular) {
	'use strict';

	function getActionColumns(platformTranslateService, basicsWorkflowApproverConfigUiService) {
		var columns = _.cloneDeep(basicsWorkflowApproverConfigUiService.getStandardConfigForListView().columns);

		return platformTranslateService.translateGridConfig(columns);
	}

	/* jshint -W072 */
	function basicsWorkflowApproverConfigController($scope, basicsWorkflowBaseGridController,
	                                                platformGridAPI, platformModuleStateService,
	                                                platformTranslateService, $timeout, platformRuntimeDataService, basicsWorkflowApproverConfigUiService, basicsWorkflowTemplateService) {

		platformModuleStateService.state('basics.workflow');

		var state = platformModuleStateService.state('basics.workflow');
		$scope.state = state;

		$scope.missingParentText = 'basics.workflow.template.selectedTemplateMissing';

		function itemsListWatchExpression() {
			return state.selectedMainEntity && state.selectedMainEntity.ApproverConfigList;
		}

		function currentItemListener(newVal, oldVal) {
			if (newVal && oldVal && newVal.Id !== oldVal.Id) {
				state.selectedApproverConfig = newVal;
			}
		}

		function currentItemWatchExpression() {
			return state.selectedApproverConfig;
		}

		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			{
				expression: currentItemWatchExpression,
				listener: currentItemListener,
				name: 'selectedApproverConfig'
			},
			{
				expression: itemsListWatchExpression,
				listener: _.noop,
				name: 'ApproverConfigList'
			},
			{
				isParentSelected: function () {
					return state.selectedMainEntity;
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
			if (state.selectedMainEntity && _.isArray(state.selectedMainEntity.ApproverConfigList)) {
				let approverConfigItems = _.filter(state.selectedMainEntity.ApproverConfigList, function (config) {
					return !config.IsDeleted;
				});

				let approverConfigItemIds = approverConfigItems.map(config => config.Id);
				basicsWorkflowTemplateService.checkTasksExistsForApproverConfigs(approverConfigItemIds).then(result => {
					let approverConfigIdMap = new Map();
					if (result.data) {
						approverConfigIdMap = new Map(result.data.map(obj => { return [obj.Item1, obj.Item2]; }));
					}

					approverConfigItems.forEach(item => {
						let isReadonly = approverConfigIdMap.has(item.Id) ? approverConfigIdMap.get(item.Id) : false;
						item.isReadonly = isReadonly;
						platformRuntimeDataService.readonly(item, isReadonly);
					});
					platformGridAPI.items.data($scope.gridId, approverConfigItems);
				});

			} else {
				platformGridAPI.items.data($scope.gridId, []);
			}
		}

		$scope.$watch(
			function () {
				return state.selectedApproverConfig;
			}, function () {
				$scope.tools.update();
			});

		var gridConfig = {
			data: state.selectedMainEntity && _.isArray(state.selectedMainEntity.ApproverConfigList) ? state.selectedMainEntity.ApproverConfigList : [],
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
							return !state.selectedMainEntity || !state.selectedMainEntity.Id || state.isReadonly;
						},
						fn: function () {
							basicsWorkflowTemplateService.createApproverConfig(state.selectedMainEntity.Id).then(function () {
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
							return !state.selectedMainEntity || !state.selectedApproverConfig || state.selectedApproverConfig.isReadonly;
						},
						fn: function () {
							state.mainItemIsDirty = true;
							state.selectedApproverConfig.IsDeleted = true;
							updateGridItems();
						}
					}
				]
			});
	}

	angular.module('basics.workflow').controller('basicsWorkflowApproverConfigController',
		['$scope', 'basicsWorkflowBaseGridController',
			'platformGridAPI', 'platformModuleStateService',
			'platformTranslateService', '$timeout', 'platformRuntimeDataService', 'basicsWorkflowApproverConfigUiService', 'basicsWorkflowTemplateService',
			basicsWorkflowApproverConfigController]);

})(angular);
