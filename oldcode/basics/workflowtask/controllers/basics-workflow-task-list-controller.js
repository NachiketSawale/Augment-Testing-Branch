/* global angular */

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflowTask';

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
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Description',
					title$tr$: 'cloud.common.entityDescription',
					getter: 'Description',
					aggregators: [],
					aggregateCollapsed: true
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
					aggregateCollapsed: true
				}
			},
			{
				id: 'clerk',
				formatter: 'comment',
				field: 'Clerk',
				name: 'Clerk',
				name$tr$: 'basics.workflowTask.taskList.colums.taskClerk',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Clerk',
					title$tr$: 'basics.workflowTask.taskList.colums.taskClerk',
					getter: 'Clerk',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'started',
				formatter: 'datetime',
				field: 'Started',
				name: 'Started',
				name$tr$: 'basics.workflowTask.taskList.colums.startTime',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Started',
					title$tr$: 'basics.workflowTask.taskList.colums.startTime',
					getter: 'Started',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'endtime',
				formatter: 'datetime',
				field: 'Endtime',
				name: 'Endtime',
				name$tr$: 'basics.workflowTask.taskList.colums.endBefore',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Endtime',
					title$tr$: 'basics.workflowTask.taskList.colums.endBefore',
					getter: 'Endtime',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'priority',
				formatter: 'comment',
				field: 'Priority',
				name: 'Priority',
				name$tr$: 'basics.workflowTask.taskList.colums.priority',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Priority',
					title$tr$: 'basics.workflowTask.taskList.colums.priority',
					getter: 'Priority',
					aggregators: [],
					aggregateCollapsed: true
				}
			},
			{
				id: 'title',
				formatter: 'comment',
				field: 'Title',
				name: 'Title',
				name$tr$: 'basics.workflowTask.taskList.colums.title',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Title',
					title$tr$: 'basics.workflowTask.taskList.colums.title',
					getter: 'Title',
					aggregators: [],
					aggregateCollapsed: true
				}
			}, {
				id: 'subTitle',
				formatter: 'comment',
				field: 'SubTitle',
				name: 'Sub Title',
				name$tr$: 'basics.workflowTask.taskList.colums.subTitle',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'SubTitle',
					title$tr$: 'basics.workflowTask.taskList.colums.subTitle',
					getter: 'SubTitle',
					aggregators: [],
					aggregateCollapsed: true
				}
			}, {
				id: 'userDefined1',
				formatter: 'comment',
				field: 'UserDefined1',
				name: 'User Defined 1',
				editor: 'comment',
				name$tr$: 'basics.workflowTask.taskList.colums.userDefined1',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'User Defined 1',
					title$tr$: 'basics.workflowTask.taskList.colums.userDefined1',
					getter: 'UserDefined1',
					aggregators: [],
					aggregateCollapsed: true
				}
			}, {
				id: 'userDefined2',
				formatter: 'comment',
				field: 'UserDefined2',
				name: 'User Defined 2',
				editor: 'comment',
				name$tr$: 'basics.workflowTask.taskList.colums.userDefined2',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'User Defined 2',
					title$tr$: 'basics.workflowTask.taskList.colums.userDefined2',
					getter: 'UserDefined2',
					aggregators: [],
					aggregateCollapsed: true
				}
			}, {
				id: 'userDefined3',
				formatter: 'comment',
				field: 'UserDefined3',
				name: 'User Defined 3',
				editor: 'comment',
				name$tr$: 'basics.workflowTask.taskList.colums.userDefined3',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'User Defined 3',
					title$tr$: 'basics.workflowTask.taskList.colums.userDefined3',
					getter: 'UserDefined3',
					aggregators: [],
					aggregateCollapsed: true
				}
			}, {
				id: 'userDefined4',
				formatter: 'comment',
				field: 'UserDefined4',
				name: 'User Defined 4',
				editor: 'comment',
				name$tr$: 'basics.workflowTask.taskList.colums.userDefined4',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'User Defined 4',
					title$tr$: 'basics.workflowTask.taskList.colums.userDefined4',
					getter: 'UserDefined4',
					aggregators: [],
					aggregateCollapsed: true
				}
			}, {
				id: 'userDefined5',
				formatter: 'comment',
				field: 'UserDefined5',
				name: 'User Defined 5',
				editor: 'comment',
				name$tr$: 'basics.workflowTask.taskList.colums.userDefined5',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'User Defined 5',
					title$tr$: 'basics.workflowTask.taskList.colums.userDefined5',
					getter: 'UserDefined5',
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
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Status',
					title$tr$: 'cloud.common.entityStatus',
					getter: 'StatusName',
					aggregators: [],
					aggregateCollapsed: true
				}
			},

		];
	}

	function prepareTaskList(list, state, basicsWorkflowInstanceService) {
		_.forEach(list, function (item) {
			try {
				item = basicsWorkflowInstanceService.prepareTask(item);
				item.Priority = _.find(state.priority, {Id: item.PriorityId}).Description;
				try {
					item.Context = angular.fromJson(item.Context);
				} catch (e) {
					item.Context = {};
				}
			} catch (e) {
				console.warn(e);
			}
		});

		return list;
	}

	function taskListCtrl($scope, basicsWorkflowBaseGridController, platformGridAPI, platformTranslateService, platformModuleStateService, basicsWorkflowInstanceService, platformModalService, basicsWorkflowTemplateService, basicsWorkflowModuleUtilService, $rootScope, cloudDesktopSidebarService, platformDialogService, $translate) {
		$scope.task = {};
		var state = platformModuleStateService.state(moduleName);

		var columns = getColumns();

		basicsWorkflowBaseGridController.extend($scope, moduleName,
			{expression: getCurrentItem, listener: whenCurrentItemChanged, name: 'selectedMainEntity'},
			{expression: selectedExpression, listener: selectedListender, name: 'mainEntities'}
		);

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
		platformTranslateService.translateGridConfig(gridConfig);
		$scope.configGrid(gridConfig);

		function selectedExpression() {
			return state.mainEntities;
		}

		function selectedListender(newVal) {
			if (newVal) {
				platformGridAPI.items.data($scope.gridId, prepareTaskList(basicsWorkflowInstanceService.taskListForModule, state, basicsWorkflowInstanceService));
			}
		}

		// Funtion to show total numbers of task in a list in Task Module.
		function updateCallbackFn() {
			platformGridAPI.items.data($scope.gridId, prepareTaskList(basicsWorkflowInstanceService.taskListForModule, state, basicsWorkflowInstanceService));
		}

		basicsWorkflowInstanceService.updateCallbackFn = updateCallbackFn;

		function getCurrentItem() {
			return state.selectedMainEntity;
		}

		function whenCurrentItemChanged(newVal, oldVal) {
			if (newVal && (newVal !== oldVal)) {
				platformGridAPI.rows.selection({
					gridId: $scope.gridId,
					rows: [newVal],
					nextEnter: false
				});
				$rootScope.$emit('updateRequested');
				basicsWorkflowInstanceService.saveSelectedTask(newVal).then(function () {

					},
					function () {
						console.error('Save Task Failed');
					});
			}
			// newVal is null, means 0 selected items in grid
			$scope.changeToolbar(null, true);
		}

		function deleteTaskRecord() {
			var taskIdList = basicsWorkflowModuleUtilService.getCurrentOrSelectedItem(state.selectedMainEntity);         // An array of the task action Ids.
			platformModalService.showYesNoDialog('basics.workflowTask.deleteTask.deleteConfirmation', 'basics.workflowTask.deleteTask.header', 'no')
				.then(function (result) {
					if (result.yes) {
						basicsWorkflowInstanceService.escalateTaskInBulk(taskIdList).then(function (response) {
							platformGridAPI.items.data($scope.gridId, state.mainEntities);
							platformModalService.showMsgBox('basics.workflowTask.action.escalation.taskEscalation', 'basics.workflowTask.action.escalation.header', 'info');
							if (response) {
								state.selectedMainEntity = response;
							}
						});
					}
				});
		}

		platformGridAPI.filters.showSearch($scope.gridId, false);

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't1',
						caption: 'basics.workflowTask.tools.finishTask',
						type: 'item',
						iconClass: 'tlb-icons ico-task-ok',
						sort: 1,
						fn: function () {
							bulkFinishTaskRecord();
						},
						disabled: function () {
							if (_.isArray(state.selectedMainEntity)) {
								return _.some(state.selectedMainEntity, function (entity) {
									return entity.ActionId !== '00000000000000000000000000000000';
								});
							} else if (state.selectedMainEntity) {
								return state.selectedMainEntity.ActionId !== '00000000000000000000000000000000';
							}
							return true;
						},
					},
					{
						id: 'delete',
						caption: 'basics.workflowTask.tools.escalateTask',
						type: 'item',
						iconClass: 'tlb-icons ico-task-escalate',
						sort: 2,
						fn: function () {
							deleteTaskRecord();
						},
						disabled: function () {
							return _.isEmpty(getCurrentItem());
						}
					},
					{
						id: 't4',
						caption: 'cloud.common.toolbarSearch',
						type: 'check',
						iconClass: 'tlb-icons ico-search',
						value: platformGridAPI.filters.showSearch($scope.gridId),
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
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						fn: function () {
							platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value);
						},
						value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
						disabled: false
					},
				]
			});

		$scope.tools.items.splice(3, 0, $scope.tools.items[0]);
		$scope.tools.items.splice(0, 1);

		function refreshList() {
			var filter = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(filter);
			basicsWorkflowInstanceService.getTaskListByFilter(filter);
		}

		function bulkFinishTaskRecord() {
			var taskIdList = basicsWorkflowModuleUtilService.getCurrentOrSelectedItem(state.selectedMainEntity);         // An array of the task action Ids.
			let confirmationMessage = $translate.instant('basics.workflowTask.countinueTask.statusConfirmation', {taskCount: taskIdList.length});
			let finishedMessage = $translate.instant('basics.workflowTask.countinueTaskStatus.taskChangeSuccessfully.taskFinishedStatus', {taskCount: taskIdList.length});
			platformDialogService.showYesNoDialog(confirmationMessage, 'basics.workflowTask.countinueTask.header', 'yes')
				.then(function (result) {
					if (result.yes) {
						basicsWorkflowInstanceService.continueWorkflowByActionInBulk(taskIdList).then(function (response) {
							platformDialogService.showMsgBox(finishedMessage, 'basics.workflowTask.countinueTaskStatus.taskChangeSuccessfully.header', 'info');
							if (response) {
								state.selectedMainEntity = response;
							}
						});
					}
				});
		}

		basicsWorkflowInstanceService.refreshTaskModuleList = refreshList;

		if (!cloudDesktopSidebarService.checkStartupFilter()) {
			refreshList();
		}
	}

	angular.module(moduleName)
		.controller('basicsWorkflowTaskListController', ['$scope', 'basicsWorkflowBaseGridController', 'platformGridAPI',
			'platformTranslateService', 'platformModuleStateService', 'basicsWorkflowInstanceService', 'platformModalService', 'basicsWorkflowTemplateService', 'basicsWorkflowModuleUtilService', '$rootScope', 'cloudDesktopSidebarService', 'platformDialogService', '$translate', taskListCtrl]);

})(angular);
