/**
 * Created by baf on 05.09.2017.
 */
/* global _, moment */
(function (angular) {
	'use strict';

	angular.module('platform').controller('platformPlanningBoardAssignmentController', PlatformPlanningBoardAssignmentController);

	PlatformPlanningBoardAssignmentController.$inject = ['$scope', '$injector', '$document', '$translate', '$q',
		'platformPlanningBoardDataService',
		'platformGridAPI',
		'platformPlanningBoardConfigService',
		'platformStatusIconService',
		'basicsCommonChangeStatusService',
		'platformPlanningBoardStatusService',
		'platformNavBarService',
		'platformModalService',
		'platformPlanningBoardTagGridConfigService',
		'platformDialogService',
		'platformDataServiceModificationTrackingExtension'
	];

	function PlatformPlanningBoardAssignmentController($scope, $injector, $document, $translate, $q,
		platformPlanningBoardDataService,
		platformGridAPI,
		platformPlanningBoardConfigService,
		platformStatusIconService,
		basicsCommonChangeStatusService,
		platformPlanningBoardStatusService,
		platformNavBarService,
		platformModalService,
		platformPlanningBoardTagGridConfigService,
		platformDialogService,
		platformDataServiceModificationTrackingExtension) {

		let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID());

		var planningBoardTools, containerScope, moveModeTools;
		$scope.planningBoardDefaultSave = platformNavBarService.getActionByKey('save').fn;
		$scope.defaultAggregationHeight = 20;

		containerScope = $scope.$parent;
		while (containerScope && !containerScope.hasOwnProperty('setTools')) {
			containerScope = containerScope.$parent;
		}

		// ALM 121365: add status bar time period filter
		function addStatusbarFilter() {
		// copies properties from selectedItem to the scope variables etc.
			function copyToScope(selectedItem) {
				var start, end;
				switch (selectedItem.chartIntervalFk) {
					case 2: // year
						start = moment.utc().startOf('year');
						end = start.clone().endOf('year');
						break;
					case 3: // quarter
						start = moment.utc().startOf('quarter');
						end = start.clone().endOf('quarter');
						break;
					case 4: // custom
						start = selectedItem.intervalStart.clone();
						end = selectedItem.intervalEnd.clone();
						break;
					default: // also case 1: default of planning board is current month
						start = moment.utc().startOf('month');
						end = start.clone().endOf('month');
						break;
				}
				planningBoardDataService.getDateStart(start);
				planningBoardDataService.getDateEnd(end);
				planningBoardDataService.saveCurrentZoomLevel();
				planningBoardDataService.planningBoardReDraw();
				planningBoardDataService.loadRest();
			}

			if (!$scope.selectedItem) {
				$scope.selectedItem = { chartIntervalFk: 1,
					intervalStart: moment.utc($scope.getDateStart()),
					intervalEnd: moment.utc($scope.getDateEnd())};
			}

			// timeout is needed because statusbar is not present at this moment
			setTimeout(() => {
				$injector.get('platformChartInterval')
					.init($scope, $scope.selectedItem, copyToScope, 'chartIntervalFk', 'intervalStart', 'intervalEnd')
					.extendStatusBar();
			}, 200);
		}

		var planningBoardModes = {
			'setDefault': {
				id: 'setDefault',
				name: 'platform.planningboard.setDefault',
				actionType: 'setDefault',
				iconClass: 'status-icons ico-status06',
				events: {
					'drag': true
				}
			},
			'createMode': {
				id: 'createAssignmentWithDemand',
				name: 'platform.planningboard.onDemand',
				actionType: 'createAssignment',
				iconClass: 'status-icons ico-status63',
				events: {
					'drag': false
				}
			}
		};

		var statusActionListItems = [];
		var assignmentStatusService = planningBoardDataService.getAssignmentConfig().mappingService.getStatusService();
		assignmentStatusService.getAssignmentStatus().then(function (list) {
			_.forEach(list, function (val) {
				if (val.isLive) {
					var resStatusIconPath = (val.icon) ? platformStatusIconService.getImageResById(val.icon) : '';
					var item = {
						id: 'statusItem_' + val.Id,
						type: 'item',
						actionType: 'setStatus',
						caption: val.Description,
						iconClass: resStatusIconPath,
						events: {
							'drag': false
						},
						fn: function () {
							setPlanningBoardMode(this);
						}
					};
					statusActionListItems.push(item);
				}
			});
			updateToolbarButtonStates();
		});

		var searchToolbarIcon =
			{
				id: 'searchBoth',
				sort: 100,
				caption: 'cloud.common.taskBarSearch',
				type: 'check',
				iconClass: 'tlb-icons ico-search other',
				value: false,
				fn: function (id) {
					planningBoardDataService.activeSearchMode = this.value ? id : '';
					platformGridAPI.filters.showSearch($scope.supplierGridId, this.value);
					if($scope.demandGridId){
						platformGridAPI.filters.showSearch($scope.demandGridId, this.value);
					}
					$scope.$broadcast('showFilterPanel', this.value);
					if (this.value) {
						platformGridAPI.filters.showColumnSearch($scope.supplierGridId, false);
						if($scope.demandGridId){
							platformGridAPI.filters.showColumnSearch($scope.demandGridId, false);
						}
					}
					columnSearchToolbarIcon.value = false; // turn off active state of search icon
				},
				disabled: function () {
					return $scope.showInfoOverlay;
				}
			};

		var columnSearchToolbarIcon =
			{
				id: 'columnSearch',
				sort: 110,
				caption: 'cloud.common.taskBarColumnFilter',
				type: 'check',
				iconClass: 'tlb-icons ico-search-column',
				value: false,
				fn: function (id) {
					planningBoardDataService.activeSearchMode = this.value ? id : '';
					platformGridAPI.filters.showColumnSearch($scope.supplierGridId, this.value);
					if($scope.demandGridId){
						platformGridAPI.filters.showColumnSearch($scope.demandGridId, this.value);
					}
					if (this.value) {
						platformGridAPI.filters.showSearch($scope.supplierGridId, false);
						if($scope.demandGridId){
							platformGridAPI.filters.showSearch($scope.demandGridId, false);
						}
						$scope.$broadcast('showFilterPanel', false);
					}
					searchToolbarIcon.value = false; // turn off active state of search icon
				},
				disabled: function () {
					return $scope.showInfoOverlay;
				}
			};

		$scope.columnSearchToolbarIcon = columnSearchToolbarIcon; // need this to enable active selected status from directive

		planningBoardTools = [{
			id: 'planningBordModes',
			sort: 10,
			iconClass: 'status-icons ico-status06',
			type: 'dropdown-btn',
			caption: 'planningBoardMode',
			showTitles: false,
			list: {
				showImages: true,
				cssClass: 'dropdown-menu-right',
				items: [{
					id: 'setDefault',
					caption: 'platform.planningboard.setDefault',
					type: 'item',
					iconClass: 'status-icons ico-status06',
					actionType: 'setDefault',
					events: {
						'drag': true
					},
					fn: function () {
						setPlanningBoardMode(this);
					}
				},
				{
					id: 'createAssignment',
					caption: 'platform.planningboard.create',
					tooltip : 'platform.planningboard.createAssignmentTooltip',
					type: 'item',
					iconClass: 'tlb-icons ico-draw',
					actionType: 'createAssignment',
					events: {
						'drag': false
					},
					fn: function () {
						setPlanningBoardMode(this);
					}
				},
				{
					id: 'setStatus',
					caption: 'platform.planningboard.setStatus',
					type: 'dropdown-btn',
					list: {
						showImages: true,
						items: statusActionListItems
					}
				}]
			}
		},
		{
			id: 'delAssignment',
			sort: 3,
			caption: 'Delete Assignment',
			type: 'item',
			iconClass: 'tlb-icons ico-rec-delete',
			fn: planningBoardDataService.deleteSelectedAssignment,
			disabled: function () {
				return !planningBoardDataService.canDeleteAssignment();
			}
		},


		// grouping destroys grid with unusual or extraordinary line height
		/* {
						id: 'groupBoth',
						sort: 5,
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						value: false,
						fn: function () {
							platformGridAPI.grouping.toggleGroupPanel($scope.supplierGridId, this.value); // supplierGridId
							platformGridAPI.grouping.toggleGroupPanel($scope.demandGridId, this.value); // demandGridId

						},
						disabled: function () {
							return $scope.showInfoOverlay;
						}
					}, */
		/*
					{
						id: 'weekBack',
						sort: 10,
						caption: 'platform.planningboard.weekBack',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-first',
						fn: function () {
							platformPlanningBoardDataService.decDate(7);
						}
					},
					{
						id: 'dayBack',
						sort: 20,
						caption: 'platform.planningboard.dayBack',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-previous',
						fn: function () {
							platformPlanningBoardDataService.decDate(1);
						}
					},
					*/
		{
			id: 'lockCalendar',
			sort: 25,
			caption: 'platform.planningboard.lockCalendar',
			type: 'check',
			value: false, // must be dynamic
			iconClass: 'tlb-icons ico-break',
			fn: function () {
				planningBoardDataService.isCalendarLocked(this.value);
			}
		},
		{
			id: 'dayToday',
			sort: 30,
			caption: 'platform.planningboard.today',
			type: 'item',
			iconClass: 'tlb-icons ico-date',
			fn: function () {
				planningBoardDataService.clickToday();
			}
		},
		/*
					{
						id: 'dayForward',
						sort: 40,
						caption: 'platform.planningboard.dayForward',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-next',
						fn: function () {
							platformPlanningBoardDataService.incDate(1);
						}
					},
					{
						id: 'weekForward',
						sort: 50,
						caption: 'platform.planningboard.weekForward',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-last',
						fn: function () {
							platformPlanningBoardDataService.incDate(7);
						}
					},
					 */
		{
			id: 'zoomIn',
			sort: 60,
			caption: 'platform.planningboard.zoomIn',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-in',
			fn: function () {
				planningBoardDataService.zoomIn();
			}
		},
		{
			id: 'zoomNorm',
			sort: 70,
			caption: 'platform.planningboard.zoomNormal',
			type: 'dropdown-btn',
			iconClass: 'tlb-icons ico-zoom-100',
			list: {
				showImages: true,
				cssClass: 'dropdown-menu-right',
				items: [{
					id: 'zoomOneWeek',
					type: 'item',
					iconClass: ' tlb-icons ico-zoom-100',
					caption: 'platform.planningboard.zoomOneWeek',
					fn: function () {
						planningBoardDataService.zoomReset(1, 'week');
					}
				}, {
					id: 'zoomTwoWeek',
					type: 'item',
					iconClass: ' tlb-icons ico-zoom-100',
					caption: 'platform.planningboard.zoomTwoWeek',
					fn: function () {
						planningBoardDataService.zoomReset(2, 'week');
					}
				}, {
					id: 'zoomOneMonth',
					type: 'item',
					iconClass: ' tlb-icons ico-zoom-100',
					caption: 'platform.planningboard.zoomOneMonth',
					fn: function () {
						planningBoardDataService.zoomReset(1, 'month');
					}
				}]
			}
		},
		{
			id: 'zoomOut',
			sort: 80,
			caption: 'platform.planningboard.zoomOut',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-out',
			fn: function () {
				planningBoardDataService.zoomOut();
			}
		},
		// {
		// id: 'refreshData',
		// sort: 90,
		// caption: 'platform.planningboard.refreshData',
		// type: 'item',
		// iconClass: 'tlb-icons ico-refresh',
		// fn: function () {
		// platformPlanningBoardDataService.load();
		// }
		// },
		searchToolbarIcon,
		columnSearchToolbarIcon,
		{
			id: 'gridSettingsGroup',
			sort: 120,
			iconClass: 'gridSettingsGroup',
			type: 'sublist',
			caption: 'platform.planningboard.settingsGroup',
			list: {
				showTitles: false,
				items: [{
					id: 'platform.planningboard.settings',
					caption: 'platform.planningboard.settings',
					type: 'dropdown-btn',
					iconClass: ' tlb-icons ico-settings',
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 'supplierGridSetting',
							type: 'item',
							caption: 'platform.planningboard.supplierSettings',
							fn: function () {
								platformGridAPI.configuration.openConfigDialog($scope.supplierGridId);
							}
						}, {
							id: 'demandGridSetting',
							type: 'item',
							caption: 'platform.planningboard.demandSettings',
							fn: function () {
								platformGridAPI.configuration.openConfigDialog($scope.demandGridId);
							},
							hideItem: !$scope.demandGridId
						}, {
							id: 'assignmentTimeline',
							type: 'item',
							caption: 'platform.planningboard.configDialog',
							fn: function () {
								if (!platformGridAPI.grids.exist(platformPlanningBoardTagGridConfigService.uuid)) {
									// initialize tag grid
									//platformPlanningBoardTagGridConfigService.createTagGrid([]);
								}
								platformPlanningBoardConfigService.show(containerScope.getContainerUUID());
							}
						}]
					}
				}]
			}
		}
		];

		moveModeTools = [{
			id: 'moveModes',
			sort: 9,
			iconClass: 'tlb-icons ico-move-day',
			type: 'dropdown-btn',
			caption: 'platform.gantt.moveModes',
			showTitles: false,
			list: {
				showImages: true,
				cssClass: 'dropdown-menu-right',
				activeValue: 'day',
				items: [{
					id: 'auto',
					caption: 'platform.gantt.auto',
					type: 'radio',
					value: 'auto',
					iconClass: 'tlb-icons ico-move-automatic',
					fn: function () {
						setMoveMode(this);
					}
				}, {
					id: 'hour',
					caption: 'platform.gantt.hour',
					type: 'radio',
					value: 'hour',
					iconClass: 'tlb-icons ico-move-hour',
					fn: function () {
						setMoveMode(this);
					}
				}, {
					id: 'day',
					caption: 'platform.gantt.day',
					type: 'radio',
					value: 'day',
					iconClass: 'tlb-icons ico-move-day',
					fn: function () {
						setMoveMode(this);
					}
				}, {
					id: 'week',
					caption: 'platform.gantt.week',
					type: 'radio',
					value: 'week',
					iconClass: 'tlb-icons ico-move-week',
					fn: function () {
						setMoveMode(this);
					}
				}]
			}
		}];

		// add move mode tools
		_.forEach(moveModeTools, function (tool) {
			planningBoardTools.unshift(tool);
		});


		const dateShiftConfig = planningBoardDataService.getDateshiftConfig();
		const { dateShiftHelperService, dataService, dateShiftToolConfig } = dateShiftConfig || {};
		if (dateShiftHelperService && dataService && _.isEmpty($scope.dateShiftModeTools)) {
			const toolsConfig = dateShiftToolConfig && dateShiftToolConfig.tools ? dateShiftToolConfig.tools : [];
			const configId = dateShiftToolConfig && dateShiftToolConfig.configId ? dateShiftToolConfig.configId : null;
			$scope.dateShiftModeTools = dateShiftHelperService.getDateshiftTools(dataService.getServiceName(), toolsConfig, configId, $scope);
		}

		if (!_.isEmpty($scope.dateShiftModeTools)) {
			planningBoardTools.unshift(...$scope.dateShiftModeTools);
		}


		// add grouping mode in planningboardModes dropdown
		if (_.isFunction(planningBoardDataService.getAssignmentConfig().mappingService.grouping)) {
			planningBoardTools.forEach(planningboardMode => {
				if (planningboardMode.id === 'planningBordModes') {
					planningboardMode.list.items.unshift({
						id: 'grouping',
						caption: 'platform.planningboard.capacityHistogram',
						type: 'item',
						iconClass: 'tlb-icons ico-group-columns',
						actionType: 'grouping',
						events: {
							'drag': true
						},
						fn: function () {
							setPlanningBoardMode(this);
							planningBoardDataService.planningBoardReDraw(true);
						}
					});
				}
			});
		}

		// add custom tools
		if (!_.isUndefined($scope.toolbarConfig) && !_.isUndefined($scope.toolbarConfig.customTools)) {
			planningBoardTools.unshift({
				id: 'dType',
				sort: 19,
				type: 'divider'
			});
			_.forEach($scope.toolbarConfig.customTools, function (tool) {
				planningBoardTools.unshift(tool);
			});
		}
		// remove not needed tools
		if (!_.isUndefined($scope.toolbarConfig) && !_.isUndefined($scope.toolbarConfig.removeTools)) {
			planningBoardTools = _.filter(planningBoardTools, function (tool) {
				return removeToolsDeep(tool);
			});
		}

		function removeToolsDeep(tool) {
			if (_.indexOf($scope.toolbarConfig.removeTools, tool.id) === -1) {
				if (!_.isUndefined(tool.list) && !_.isUndefined(tool.list.items) && tool.list.items.length > 0) {
					tool.list.items = _.filter(tool.list.items, function (item) {
						return removeToolsDeep(item);
					});
				}
				return tool;
			}
		}

		containerScope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: planningBoardTools
		});

		function updateToolbarButtonStates() {
			// remove default setting toolbarSetting
			var commonToolbarSettingIndex = _.findIndex(containerScope.tools.items, {'caption': 'cloud.common.toolbarSetting'});
			if (commonToolbarSettingIndex > -1) {
				containerScope.tools.items.splice(commonToolbarSettingIndex, 1);
			}

			containerScope.tools.update();
		}

		function updateSettingsRowHeight(newLineHeight) {
			platformPlanningBoardConfigService.updateSettingsRowHeight(containerScope.getContainerUUID(), newLineHeight);
		}

		var planningboardChangeMultipleStatus = function () {
			var config = {
				isSimpleStatus: false,
				statusName: planningBoardDataService.getAssignmentConfig().mappingService.entityTypeName(), // 'resreservationstatus',
				remark: '',
			};
			return basicsCommonChangeStatusService.changeMultipleStatus(config, platformPlanningBoardStatusService.getAssignmentStatusChanged()).then(function (result) {
				_.forEach(result, function (item) {
					let changedAssignmentId = item.entityId;
					if (_.isFunction(planningBoardDataService.getAssignmentConfig().mappingService.useStatusProperties)
						&& planningBoardDataService.getAssignmentConfig().mappingService.useStatusProperties()) {
						changedAssignmentId = Array.from(planningBoardDataService.assignments.values()).find((assignment) => {
							return planningBoardDataService.getAssignmentConfig().mappingService.statusEntityId(assignment) === changedAssignmentId;
						}).Id;
					}
					if (!_.isNull(item.ErrorMsg)) {
						planningBoardDataService.assignments.get(changedAssignmentId).isValid = false;
					} else {
						if (!_.isUndefined(planningBoardDataService.assignments.get(changedAssignmentId).isValid) &&
							!planningBoardDataService.assignments.get(changedAssignmentId).isValid) {
							planningBoardDataService.assignments.get(changedAssignmentId).isValid = true;
						}
					}
				});
				$scope.assignments = planningBoardDataService.assignments;
				platformPlanningBoardStatusService.clearAssignmentStatusChanged();
				return planningBoardDataService.load();
			});
		};

		function setPlanningBoardMode(item) {
			let hasModifications = platformDataServiceModificationTrackingExtension.hasModifications(planningBoardDataService.getAssignmentConfig().dataService);
			if (hasModifications) {
				platformDialogService.showYesNoDialog('platform.planningboard.sureToSaveChanges', 'platform.planningboard.assignmentModifications').then((result) => {
					if (result.yes) {
						// save changes
						return platformNavBarService.getActionByKey('save').fn().then(() => {
							// needs to set toolbar icons and redraw planningboard
							afterModeChanged(item);
							planningBoardDataService.planningBoardReDraw(true);
						});
					} else {
						// clear modifications
						afterModeChanged(item);
						return planningBoardDataService.load();
					}
				});
			} else {
				afterModeChanged(item);
				if (item.actionType === 'setStatus' && planningBoardDataService.assignmentAvailableStatusItems.length === 0) {
					// load is needed if availableStatusItems are not set
					planningBoardDataService.load();
				} else {
					// redraw only if nothing has changed
					planningBoardDataService.planningBoardReDraw(true);
				}
			}
		}

		function afterModeChanged(item) {
			changePlanningBoardCursor(item);
			changeSaveFn(item.actionType);
			_.forEach(planningBoardTools, function (tool) {
				if (tool.id === 'planningBordModes') {
					tool.iconClass = item.iconClass;
					return false;
				}
			});

			updateToolbarButtonStates();
			$scope.planningBoardMode = {
				id: item.id,
				name: item.caption,
				actionType: item.actionType,
				events: item.events
			};

			planningBoardDataService.planningBoardMode = $scope.planningBoardMode;
		}

		function changePlanningBoardCursor(item) {
			if (item.actionType === 'createAssignment') {
				$('.planningboard').css('cursor','crosshair');
			} else {
				$('.planningboard').css('cursor','default');
			}
		}

		$scope.activeMoveMode = 'day'; // default move mode
		function setMoveMode(element) {
			$scope.activeMoveMode = element.id;

			// set active mode in toolbar
			var moveModes = _.find($scope.tools.items, {
				'id': 'moveModes'
			});
			moveModes.iconClass = _.find(moveModes.list.items, {
				'id': element.id
			}).iconClass;
			$scope.tools.update();
		}

		updateToolbarButtonStates();

		enrichScope(true); // inital enrich scope

		planningBoardDataService.registerInfoChanged(enrichScope);
		platformPlanningBoardConfigService.registerOnSettingsChanged(addStatusbarFilter);

		$scope.registerDataUpdated = planningBoardDataService.registerInfoChanged;
		$scope.unregisterDataUpdated = planningBoardDataService.unregisterInfoChanged;

		planningBoardDataService.registerSelectionChanged(updateToolbarButtonStates);

		function enrichScope(isInitial = false) {
			$scope.updateSettingsRowHeight = updateSettingsRowHeight;

			$scope.validateAssignments = planningBoardDataService.validateAssignments();
			$scope.showAggregations = planningBoardDataService.showAggregations();
			$scope.showSumAggregations = planningBoardDataService.showSumAggregations();
			$scope.useMinAggregation = planningBoardDataService.useMinAggregation();
			$scope.useTaggingSystem = planningBoardDataService.useTaggingSystem();
			$scope.useFixedAssignmentHeight = planningBoardDataService.useFixedAssignmentHeight();
			$scope.tagConfig = planningBoardDataService.tagConfig();
			$scope.collectionConfig = planningBoardDataService.collectionConfig();
			$scope.aggregationTrafficLightsConfig = planningBoardDataService.aggregationTrafficLightsConfig();
			// $scope.tagConfig.state = platformPlanningBoardTagGridConfigService.uuid;
			$scope.rowHeight = planningBoardDataService.getRowHeightFromSettings();
			$scope.flexibleRowHeight = planningBoardDataService.useFlexibleRowHeight();
			$scope.showDemandPreview = planningBoardDataService.getDemandDraggingInfo();
			$scope.rowHeightAssignments = planningBoardDataService.getRowHeightFromSettings();
			$scope.rowHeightAssignments = (!$scope.showAggregations) ? $scope.rowHeightAssignments : $scope.rowHeightAssignments - $scope.defaultAggregationHeight;
			$scope.showHeaderColor = planningBoardDataService.showHeaderColor();
			$scope.showStatusIcon = planningBoardDataService.showStatusIcon();
			$scope.backgroundColorConfig = planningBoardDataService.backgroundColorConfig();
			$scope.showTypeIcon = planningBoardDataService.showTypeIcon();
			$scope.showHeaderBackground = planningBoardDataService.showHeaderBackground();
			$scope.showSameAssignments = planningBoardDataService.showSameAssignments();
			$scope.showMainText = planningBoardDataService.showMainText();
			$scope.showInfo1Text = planningBoardDataService.showInfo1Text();
			$scope.showInfo2Text = planningBoardDataService.showInfo2Text();
			$scope.showInfo3Text = planningBoardDataService.showInfo3Text();
			$scope.mainInfoLabel = planningBoardDataService.mainInfoLabel();
			$scope.info1Label = planningBoardDataService.info1Label();
			$scope.info2Label = planningBoardDataService.info2Label();
			$scope.info3Label = planningBoardDataService.info3Label();
			$scope.snapToDays = planningBoardDataService.snapToDays();
			$scope.saveLastZoom = planningBoardDataService.saveLastZoom();
			$scope.selectedZoomLevel = planningBoardDataService.selectedZoomLevel();
			$scope.minAggregationLevel = planningBoardDataService.minAggregationLevel();
			$scope.sumAggregationLine1 = planningBoardDataService.sumAggregationLine1();
			$scope.sumAggregationLine2 = planningBoardDataService.sumAggregationLine2();
			$scope.sumAggregationLine3 = planningBoardDataService.sumAggregationLine3();
			$scope.useDemandTimesForReservation = planningBoardDataService.useDemandTimesForReservation();

			$scope.gridSettings = [];
			$scope.gridSettings.validateDemandAgainstSuppliers = planningBoardDataService.gridSettings.validateDemandAgainstSuppliers();
			$scope.gridSettings.filterDemands = planningBoardDataService.gridSettings.filterDemands();

			$scope.exceptionDays = planningBoardDataService.exceptionDays;
			$scope.weekDays = planningBoardDataService.weekDays;
			$scope.suppliers = planningBoardDataService.suppliers;
			$scope.assignments = planningBoardDataService.assignments;
			$scope.demands = planningBoardDataService.demands;

			$scope.assignmentStatusItems = planningBoardDataService.assignmentStatusItems;
			$scope.assignmentTypeItems = planningBoardDataService.assignmentTypeItems;

			$scope.getDateStart = planningBoardDataService.getDateStart;
			$scope.getDateEnd = planningBoardDataService.getDateEnd;
			$scope.getTimeScaleHoursX = planningBoardDataService.getTimeScaleHoursX;

			$scope.createAssignment = planningBoardDataService.createAssignment;
			$scope.updateAssignment = planningBoardDataService.updateAssignment;
			$scope.updateDemand = planningBoardDataService.updateDemand;
			$scope.setSelectedAssignment = planningBoardDataService.setSelectedAssignment;
			$scope.addToSelectedAssignment = planningBoardDataService.addToSelectedAssignment;
			$scope.load = planningBoardDataService.load;
			$scope.loadRest = planningBoardDataService.loadRest;

			$scope.supplierConfig = planningBoardDataService.getSupplierConfig();
			$scope.assignmentConfig = planningBoardDataService.getAssignmentConfig();
			$scope.demandConfig = planningBoardDataService.getDemandConfig();
			$scope.demandGridId = false;
			if (!_.isNull($scope.demandConfig)) {
				$scope.demandGridId = $scope.demandConfig.uuid;
			}

			$scope.getFilteredItems = getFilteredItems;
			$scope.supplierGridId = $scope.supplierConfig.uuid;

			if (!$scope.verticalIndex || $scope.verticalIndex.size === 0) {
				$scope.verticalIndex = $scope.getFilteredItems($scope.supplierConfig.uuid);
			}

			if (isInitial) {
				addStatusbarFilter(); // ALM 121365
			}
		}

		function changeSaveFn(type) {
			switch (type) {
				case 'setStatus':
					platformNavBarService.getActionByKey('save').fn = planningboardChangeMultipleStatus;
					break;
				case 'setDefault':
					platformNavBarService.getActionByKey('save').fn = $scope.planningBoardDefaultSave;
					break;
			}
		}

		$scope.$on('$destroy', function cleanupHandlers() {

			// reset toolbar iconclass - should be fixed in framework
			_.forEach(planningBoardTools, function (tool) {
				if (tool.id === 'planningBordModes') {
					tool.iconClass = 'status-icons ico-status06';
					return false;
				}
			});

			statusActionListItems = [];
			if (containerScope.tools) {
				containerScope.tools.items = [];
				containerScope.tools.update();
			}

			planningBoardDataService.unregisterInfoChanged(enrichScope);
			planningBoardDataService.unregisterSelectionChanged(updateToolbarButtonStates);
			planningBoardDataService.unregisterUpdateDone();
			planningBoardDataService.unregisterSupplierListLoaded();
			planningBoardDataService.unregisterSelectedAssignmentChanged();
			planningBoardDataService.unregisterAssignmentListLoaded();
			planningBoardDataService.unregisterParentDataServiceListLoadStarted();
			platformPlanningBoardConfigService.unregisterOnSettingsChanged(addStatusbarFilter);
			// platformNavBarService.getActionByKey('save').fn = $scope.planningBoardDefaultSave;
		});

		function getFilteredItems(containerId) {
			var platformGridAPI = $injector.get('platformGridAPI');
			var result = platformGridAPI.grids.getGridState(containerId, false);

			// generate a map with [key=id, value=ido 0..n] ... multiplication with lineHeight is done @ D3 components
			var itemsmap = new Map();
			// result.filteredItems.entries.length is always 0 AND THROWS AN ERROR IE 11
			if (_.isObject(result) && result.filteredItems.size > 0) {
				var idx = 0;
				result.filteredItems.forEach(function f(val, key) {
					itemsmap.set(key, idx++);
				});
			} else {
				/* todo: delete if no error report (created on 06.04.2020)
				for (var i = 0; i < platformPlanningBoardDataService.suppliers.length; i++) {
					var supplier = platformPlanningBoardDataService.suppliers[i];
					itemsmap.set(supplier.Id, i);
				}
				*/
			}

			return itemsmap;
		}

	}
})(angular);
