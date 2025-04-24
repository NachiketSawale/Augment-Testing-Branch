/* global moment, _ */

(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingMainActivityListControllerGantt', SchedulingMainActivityListController);

	SchedulingMainActivityListController.$inject = [
		'$scope', '$timeout', '$injector', 'platformGridControllerService', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'basicsLookupdataLookupDescriptorService', 'schedulingMainService', 'schedulingMainHammockDataService',
		'schedulingMainDueDateService', 'schedulingMainHammockAllService', 'schedulingMainRelationshipAllService', 'schedulingProjectScheduleService', 'platformPermissionService', 'platformContextMenuItems'
	];

	function SchedulingMainActivityListController(
		$scope, $timeout, $injector, platformGridControllerService, platformContainerControllerService, platformContainerCreateDeleteButtonService, basicsLookupdataLookupDescriptorService, schedulingMainService, schedulingMainHammockDataService,
		schedulingMainDueDateService, schedulingMainHammockAllService, schedulingMainRelationshipAllService, schedulingProjectScheduleService, platformPermissionService, platformContextMenuItems) {
		basicsLookupdataLookupDescriptorService.updateData('activityfk', schedulingMainService.getList());

		platformContainerControllerService.initController($scope, 'scheduling.main', '13120439D96C47369C5C24A2DF29238E');
		var schedule = schedulingMainService.getSelectedSchedule();
		var containerScope = $scope.$parent;
		while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
			containerScope = containerScope.$parent;
		}

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [{
				id: 'ac',
				caption: 'scheduling.main.activityChain',
				type: 'item',
				iconClass: 'control-icons ico-link-activities-relationship',
				fn: schedulingMainRelationshipAllService.addRelationships,
				disabled: function () {
					// Permission check
					var condition1 = !platformPermissionService.hasCreate(containerScope.getContainerUUID().toLowerCase());
					// we need at least two activity items selected
					var condition2 = false; // !schedulingMainService.getSelectedEntities() || schedulingMainService.getSelectedEntities().length < 2; // we wait until multiselection  selection changed event is provided

					return condition1 || condition2;
				}
			},
			{
				id: 't1',
				caption: 'scheduling.main.changeActivityType',
				type: 'item',
				iconClass: 'tlb-icons ico-task-to-hammock',
				fn: schedulingMainService.changeActivityType,
				disabled: function () {
					// Permission check
					if (_.get(schedulingMainService.getSelected(),'IsReadOnly') === true) {
						return true;
					}
					if (!platformPermissionService.hasWrite(containerScope.getContainerUUID().toLowerCase())) {
						return true;
					}
					return schedulingMainService.toolbarEnabled();
				}
			}, Object.assign({
					id: 't11',
					caption: 'cloud.common.toolbarNewByContext',
					type: 'item',
					iconClass: 'tlb-icons ico-new',
					fn: schedulingMainService.insertNewTask,
					disabled: function () {
						// Permission check
						if (!platformPermissionService.hasCreate(containerScope.getContainerUUID().toLowerCase())) {
							return true;
						}
						return !schedulingMainService.canCreate();
					}
				}, platformContextMenuItems.setContextGroupNew())
			]
		});

		platformGridControllerService.pushToGridSettingsMenu($scope, schedulingMainService.getSettingsButtonConfig(), 'scheduling.main.settings');

		function updateStateOfToolBarButtons() {
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, schedulingMainService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		}

		schedulingMainHammockAllService.registerCallBackOnCreation(updateStateOfToolBarButtons);
		schedulingMainService.registerUpdateToolBar(updateStateOfToolBarButtons);

		/* // workaround until selectionChanged event is thrown for multi-selection
				var destroySelectionWatch = $scope.$watchCollection(schedulingMainService.getSelectedEntities(), function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				}); */

		schedulingMainService.registerSelectionChanged(updateStateOfToolBarButtons);

		function onDueDateChanged() {
			updateStatusBarReportingDate();
			if ($scope.tools) {
				$scope.tools.update();
			}

			$timeout(function () {
				$scope.$apply();
			});
		}

		schedulingMainDueDateService.registerDueDateChanged(onDueDateChanged);

		function buildFromToString() {
			if (schedule.ScheduleChartIntervalFk === 4 && moment.isMoment(schedule.ChartIntervalStartDate) &&
				moment.isMoment(schedule.ChartIntervalEndDate)) {
				return schedule.ChartIntervalStartDate.format('L') + '–' + schedule.ChartIntervalEndDate.format('L');
			}
		}

		function extendStatusBar() {
			schedule = schedulingMainService.getSelectedSchedule();

			function setChartInterval(input) {
				// jshint -W040
				var self = this || input;
				var sb = $scope.getUiAddOns().getStatusBar();
				$scope.statusBarConfig[1].value = self.caption;
				$scope.statusBarConfig[1].iconClass = self.iconClass;
				$scope.statusBarConfig[2].visible = true;
				$scope.statusBarConfig[2].value = '';
				schedule.ScheduleChartIntervalFk = self.chartIntervalFk;
				schedulingMainService.setSelectedSchedule(schedule);
				sb.updateFields($scope.statusBarConfig);
				containerScope.resetZoom();
			}

			let t = $injector.get('$translate');

			if (!$scope.statusBarConfig) {
				$scope.statusBarConfig = [{
					id: 'chartIntervalLabel',
					type: 'text',
					value: t.instant('scheduling.main.scheduleChartInterval')
				},
				{
					id: 'chartIntervalDropdown',
					caption: t.instant('scheduling.main.scheduleChartInterval'),
					type: 'dropdown-btn',
					iconClass: 'status-icons ico-status58',
					value: t.instant('scheduling.main.projectStart'),
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 'project',
							type: 'item',
							disabled: false,
							caption: 'Project start', // tr 15210
							caption$tr$: 'scheduling.main.projectStart',
							iconClass: 'status-icons ico-status58',
							chartIntervalFk: 1,
							fn: setChartInterval
						},
						{
							id: 'year',
							type: 'item',
							disabled: false,
							caption: 'Start of year', // tr15211
							caption$tr$: 'scheduling.main.startOfYear',
							iconClass: 'status-icons ico-status161',
							chartIntervalFk: 2,
							fn: setChartInterval
						},
						{
							id: 'quarter',
							type: 'item',
							disabled: false,
							caption: 'Start of quarter', // tr 15212
							caption$tr$: 'scheduling.main.startOfQuarter',
							iconClass: 'status-icons ico-status164',
							chartIntervalFk: 3,
							fn: setChartInterval
						}, {
							id: 'custom',
							type: 'item',
							disabled: false,
							caption: 'Custom date', // tr 15213
							caption$tr$: 'scheduling.main.customDate',
							iconClass: 'status-icons ico-status57',
							chartIntervalFk: 4,
							fn: function () {
								var dialogConfig;
								var formconfig = {
									fid: 'chartIntervalForm',
									version: '0.0.1',
									showGrouping: false,
									groups: [
										{
											gid: 'group1',
											attributes: []
										}
									],
									rows: [{
										gid: 'group1',
										rid: 'ChartIntervalStartDate',
										label: t.instant('scheduling.main.chartIntervalStartDate'),
										label$tr$: 'scheduling.main.chartIntervalStartDate',
										type: 'date',
										model: 'ChartIntervalStartDate',
										visible: true,
										sortOrder: 1
									}, {
										gid: 'group1',
										rid: 'ChartIntervalEndDate',
										label: t.instant('scheduling.main.chartIntervalEndDate'),
										label$tr$: 'scheduling.main.chartIntervalEndDate',
										type: 'date',
										model: 'ChartIntervalEndDate',
										visible: true,
										sortOrder: 2
									},]
								};
								dialogConfig = {
									title: t.instant('scheduling.main.customDate'),
									dataItem: schedule,
									position: '400px',
									formConfiguration: formconfig,
									handleOK: function () {
										var sb = $scope.getUiAddOns().getStatusBar();
										$scope.statusBarConfig[2].visible = true;
										$scope.statusBarConfig[2].value = buildFromToString();
										schedulingMainService.setSelectedSchedule(schedule);
										sb.updateFields($scope.statusBarConfig);
										containerScope.resetZoom();
									},
									handleCancel: function () {
										schedulingMainService.setSelectedSchedule(schedule);
										containerScope.resetZoom();
									},
									scope: $scope
								};
								setChartInterval(this);
								$injector.get('platformModalFormConfigService').showDialog(dialogConfig);
							}
						}
						]
					}
				},
				{
					id: 'customfromto',
					type: 'text',
					align: 'right',
					disabled: false,
					cssClass: '',
					toolTip: '',
					visible: true,
					ellipsis: true,
					value: ''
				},
				{
					id: 'reportingDate',
					type: 'text',
					align: 'right',
					disabled: false,
					cssClass: '',
					toolTip: '',
					visible: true,
					ellipsis: true,
					value: schedulingMainDueDateService.buildStatusBar()
				}
				];
			}

			if (schedulingMainService.getSelectedSchedule()) {
				switch (schedulingMainService.getSelectedSchedule().ScheduleChartIntervalFk) {
					case 2:
						$scope.statusBarConfig[1].value = $scope.statusBarConfig[1].list.items[1].caption;
						$scope.statusBarConfig[1].iconClass = $scope.statusBarConfig[1].list.items[1].iconClass;
						break;
					case 3:
						$scope.statusBarConfig[1].value = $scope.statusBarConfig[1].list.items[2].caption;
						$scope.statusBarConfig[1].iconClass = $scope.statusBarConfig[1].list.items[2].iconClass;
						break;
					case 4:
						$scope.statusBarConfig[1].value = $scope.statusBarConfig[1].list.items[3].caption;
						$scope.statusBarConfig[1].iconClass = $scope.statusBarConfig[1].list.items[3].iconClass;
						break;
					default:
						$scope.statusBarConfig[1].value = $scope.statusBarConfig[1].list.items[0].caption;
						$scope.statusBarConfig[1].iconClass = $scope.statusBarConfig[1].list.items[0].iconClass;
				}
			}

			return $scope.statusBarConfig;
		}

		if (_.isFunction($scope.getUiAddOns)) {
			var sb = $scope.getUiAddOns().getStatusBar();
			sb.addFields(extendStatusBar());
		}
		var updateStatusBarReportingDate = function () {
			if (_.isFunction($scope.getUiAddOns)) {
				var sb = $scope.getUiAddOns().getStatusBar();
				var fields = extendStatusBar();
				_.find(fields, {id:'reportingDate'}).value = schedulingMainDueDateService.buildStatusBar();
				sb.updateFields(extendStatusBar());
			}
		};

		$scope.$on('$destroy', function () {
			schedulingMainDueDateService.unregisterDueDateChanged(onDueDateChanged);
			schedulingMainHammockAllService.unRegisterCallBackOnCreation(updateStateOfToolBarButtons);
			schedulingMainService.unregisterUpdateToolBar(updateStateOfToolBarButtons);
		});
	}

})();
