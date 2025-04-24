/* globals angular */

(function () {
	'use strict';
	var module = 'basics.workflowAdministration';

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
				field: 'Description',
				name: 'Description',
				name$tr$: 'cloud.common.entityDescription',
				sortable: true,
				keyboard: {
					enter: false
				},
				formatter: function (row, cell, value, columnDef, dataContext) {
					return highlightSkippedAction(dataContext);
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
				id: 'result',
				formatter: 'comment',
				field: 'Result',
				name: 'Result',
				name$tr$: 'basics.workflowAdministration.common.result',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'Result',
					title$tr$: 'basics.workflowAdministration.common.result',
					getter: 'Result',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'started',
				formatter: 'datetimeSec',
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
				id: 'Endtime',
				formatter: 'datetimeSec',
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
				formatter: 'string',
				field: 'Duration',
				name: 'Duration',
				name$tr$: 'basics.workflowAdministration.commen.duration',
				sortable: true,
				minWidth: 50,
				keyboard: {
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
				field: 'UserId',
				formatter: 'lookup',
				formatterOptions: {
					displayMember: 'Description',
					lookupType: 'Clerk'
				},
				id: 'keyUserId',
				name: 'Key User',
				name$tr$: 'basics.workflowAdministration.commen.clerk',
				sortable: true,
				grouping: {
					title: 'Key User',
					title$tr$: 'basics.workflowAdministration.commen.clerk',
					getter: 'UserId',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'ProgressedBy',
				formatter: 'comment',
				field: 'ProgressedBy',
				name: 'ProgressedBy',
				name$tr$: 'basics.workflowAdministration.clientAction.progressedBy',
				sortable: true,
				keyboard: {
					enter: false
				},
				grouping: {
					title: 'ProgressedBy',
					title$tr$: 'basics.workflowAdministration.clientAction.progressedBy',
					getter: 'ProgressedBy',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Userdefined1',
				formatter: 'comment',
				field: 'Userdefined1',
				name: 'Userdefined1',
				name$tr$: 'basics.workflowAdministration.clientAction.Userdefined1',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'Userdefined1',
					title$tr$: 'basics.workflowAdministration.clientAction.Userdefined1',
					getter: 'Userdefined1',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Userdefined2',
				formatter: 'comment',
				field: 'Userdefined2',
				name: 'Userdefined2',
				name$tr$: 'basics.workflowAdministration.clientAction.Userdefined2',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'Userdefined2',
					title$tr$: 'basics.workflowAdministration.clientAction.Userdefined2',
					getter: 'Userdefined2',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Userdefined3',
				formatter: 'comment',
				field: 'Userdefined3',
				name: 'Userdefined3',
				name$tr$: 'basics.workflowAdministration.clientAction.Userdefined3',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'Userdefined3',
					title$tr$: 'basics.workflowAdministration.clientAction.Userdefined3',
					getter: 'Userdefined3',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Userdefined4',
				formatter: 'comment',
				field: 'Userdefined4',
				name: 'Userdefined4',
				name$tr$: 'basics.workflowAdministration.clientAction.Userdefined4',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'Userdefined4',
					title$tr$: 'basics.workflowAdministration.clientAction.Userdefined4',
					getter: 'Userdefined4',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'Userdefined5',
				formatter: 'comment',
				field: 'Userdefined5',
				name: 'Userdefined5',
				name$tr$: 'basics.workflowAdministration.clientAction.Userdefined5',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'Userdefined5',
					title$tr$: 'basics.workflowAdministration.clientAction.Userdefined5',
					getter: 'Userdefined5',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedMoney1',
				formatter: 'money',
				field: 'UserDefinedMoney1',
				name: 'UserDefinedMoney1',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney1',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedMoney1',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney1',
					getter: 'UserDefinedMoney1',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedMoney2',
				formatter: 'money',
				field: 'UserDefinedMoney2',
				name: 'UserDefinedMoney2',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney2',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedMoney2',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney2',
					getter: 'UserDefinedMoney2',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedMoney3',
				formatter: 'money',
				field: 'UserDefinedMoney3',
				name: 'UserDefinedMoney3',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney3',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedMoney3',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney3',
					getter: 'UserDefinedMoney3',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedMoney4',
				formatter: 'money',
				field: 'UserDefinedMoney4',
				name: 'UserDefinedMoney4',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney4',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedMoney4',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney4',
					getter: 'UserDefinedMoney4',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedMoney5',
				formatter: 'money',
				field: 'UserDefinedMoney5',
				name: 'UserDefinedMoney5',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney5',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedMoney5',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedMoney5',
					getter: 'UserDefinedMoney5',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedDate1',
				formatter: 'datetime',
				field: 'UserDefinedDate1',
				name: 'UserDefinedDate1',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate1',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedDate1',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate1',
					getter: 'UserDefinedDate1',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedDate2',
				formatter: 'datetime',
				field: 'UserDefinedDate2',
				name: 'UserDefinedDate2',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate2',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedDate2',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate2',
					getter: 'UserDefinedDate2',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedDate3',
				formatter: 'datetime',
				field: 'UserDefinedDate3',
				name: 'UserDefinedDate3',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate3',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedDate3',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate3',
					getter: 'UserDefinedDate3',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedDate4',
				formatter: 'datetime',
				field: 'UserDefinedDate4',
				name: 'UserDefinedDate4',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate4',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedDate4',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate4',
					getter: 'UserDefinedDate4',
					aggregators: [],
					aggregateCollapsed: false
				}
			},
			{
				id: 'UserDefinedDate5',
				formatter: 'datetime',
				field: 'UserDefinedDate5',
				name: 'UserDefinedDate5',
				name$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate5',
				sortable: true,
				keyboard: {
					enter: true
				},
				grouping: {
					title: 'UserDefinedDate5',
					title$tr$: 'basics.workflowAdministration.clientAction.UserDefinedDate5',
					getter: 'UserDefinedDate5',
					aggregators: [],
					aggregateCollapsed: false
				}
			}

		];
	}

	function highlightSkippedAction(dataContext) {
		if (dataContext.Result.includes(' skipped ')) {
			return '<i title="' + dataContext.Result + '" class="block-image tlb-icons ico-warning"></i>' + '<span class="highlight-skipped-action-instance pane-r slick">' + dataContext.Description + '</span>';
		} else {
			return '<span>' + dataContext.Description + '</span>';
		}
	}

	function basicsWorkflowAdministrationActionInstanceController($scope, basicsWorkflowBaseGridController,
																  platformTranslateService, basicsWorkflowAdministrationInstanceService,
																  basicsWorkflowInstanceService, platformModalService, platformGridAPI) {

		basicsWorkflowBaseGridController.extend($scope, module,
			{
				expression: selectedExpression,
				listener: selectedListener,
				name: 'selectedActionInstance'
			}, 'actionInstances');

		function selectedExpression() {
			return basicsWorkflowBaseGridController.state.selectedMainEntity;
		}

		$scope.showGridLayoutConfigDialog = function () {
			platformGridAPI.configuration.openConfigDialog($scope.gridId);
		};

		function selectedListener(newVal) {
			if (newVal && newVal.Id) {
				basicsWorkflowAdministrationInstanceService.getHistory(newVal.Id).then(function (response) {
					basicsWorkflowBaseGridController.state.actionInstances = response.data;
					basicsWorkflowBaseGridController.state.selectedActionInstance = null;
				});
			}
		}

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
				enableDraggableGroupBy: true,
			}
		};

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'delete',
						caption: 'cloud.common.toolbarDelete',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {

							if (!basicsWorkflowBaseGridController.state.selectedActionInstance) {
								platformModalService.showErrorBox('basics.workflowAdministration.action.escalation.noActionSelected',
									'basics.workflowAdministration.action.escalation.header');
								return;
							}
							if (!basicsWorkflowBaseGridController.state.selectedActionInstance.IsRunning) {
								platformModalService.showErrorBox('basics.workflowAdministration.action.escalation.actionIsNotRunning',
									'basics.workflowAdministration.action.escalation.header');
								return;
							}

							basicsWorkflowInstanceService.escalateTask(basicsWorkflowBaseGridController.state.selectedActionInstance.Id)
								.then(function () {
									basicsWorkflowAdministrationInstanceService.getList();
								});
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
				]
			});

		platformTranslateService.translateGridConfig(gridConfig);
		$scope.configGrid(gridConfig);
		basicsWorkflowBaseGridController.gridAPI.events.register($scope.gridId, 'onCellChange', function (e, data) {
			basicsWorkflowInstanceService.changeUser(data.item.Id, data.item.UserId);
		});


	}

	basicsWorkflowAdministrationActionInstanceController.$inject = ['$scope',
		'basicsWorkflowBaseGridController', 'platformTranslateService', 'basicsWorkflowAdministrationInstanceService',
		'basicsWorkflowInstanceService', 'platformModalService', 'platformGridAPI'];
	angular.module(module).controller('basicsWorkflowAdministrationActionInstanceController',
		basicsWorkflowAdministrationActionInstanceController);
})();