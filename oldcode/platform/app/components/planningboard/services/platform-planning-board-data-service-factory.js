(function () {
	'use strict';

	angular.module('platform').factory('platformPlanningBoardDataServiceFactory', PlatformPlanningBoardDataServiceFactory);

	PlatformPlanningBoardDataServiceFactory.$inject = ['$q', '$http', '$rootScope', '$injector', '_', 'moment', 'PlatformMessenger',
		'platformPlanningBoardConfigService',
		'platformDataServiceModificationTrackingExtension',
		'platformGridAPI',
		'platformPlanningBoardTagGridConfigService',
		'basicsCommonChangeStatusService',
		'$translate',
		'platformObjectHelper',
		'chartService',
		'basicsUnitLookupDataService',
		'platfromPlanningBoardCalendarService'];

	function PlatformPlanningBoardDataServiceFactory($q, $http, $rootScope, $injector, _, moment, PlatformMessenger,
		platformPlanningBoardConfigService,
		platformDataServiceModificationTrackingExtension,
		platformGridAPI,
		platformPlanningBoardTagGridConfigService,
		basicsCommonChangeStatusService,
		$translate,
		platformObjectHelper,
		chartService,
		basicsUnitLookupDataService,
		platfromPlanningBoardCalendarService) {


		return function (pbsettings, scope) {
			var service = this;

			var currentCalendarConfig = {
				value: 1,
				type: 'month',
				id: 'onemonth',
				caption: $translate.instant('platform.planningboard.zoomOneMonth')
			};
			var dateStart = moment().utc().startOf(currentCalendarConfig.type);
			var dateEnd = moment(dateStart).add(currentCalendarConfig.value, currentCalendarConfig.type);
			var lastGridStartDate, lastGridEndDate;
			var assignmentMapInitialized = false;
			var extendedDemandsLoaded;
			var lastDemandDateStart;
			var lastDemandDateEnd;
			var busyOverlay;
			let isCalendarLocked = false;
			let timeaxis;
			let verticalIndex;
			let defaultAggregationHeight = 20;
			let viewportHeightOnlyTmp = 0;
			let currentDimensions = { height: 0, width: 0};
			let availableStatiMatrix;


			let OnZoomTimeOut = 0;
			const msZoomTimeOut = 150; // humanly natural speed of "fast clicking"


			var infoChangedMessenger = new PlatformMessenger();
			var unRegisterFn = _.noop;


			function setInitialValues() {
				service.exceptionDays = [];
				service.weekDays = [];
				service.suppliers = [];
				service.demands = [];
				service.assignments = new Map();
				service.deletedAssignments = new Map();
				service.assignmentStatusItems = [];
				service.assignmentTypeItems = [];
				service.assignmentAvailableStatusItems = [];
				service.supplierCapacityPerBaseUnit = {};
			}

			setInitialValues();

			// var calendarDataService, supplierDataService, demandDataService, assignmentDataService;
			service.timeScaleDataService = false;
			service.assignmentDataService = false;
			service.supplierDataService = false;
			service.demandDataService = false;
			service.parentDataService = false;
			service.planningBoardMode = {
				'actionType': 'setDefault'
			};
			service.activeSearchMode = '';
			service.timeDimensionUoMList = [];


			var options = {
				supplierConfig: null,
				assignmentConfig: null,
				demandConfig: null,
				planningBoardSettingsList: null,
				dateShiftConfig: null
			};

			service.registerPlanningBoardEvents = (planningBoardOptions) => {
				// register for events
				if (planningBoardOptions.registerOnMainDataServiceReload) {
					registerMainDataServiceReload();
				}

				registerUpdateDone();
				if ((planningBoardOptions.demand && !planningBoardOptions.demand.demandDependOnExternal) || !planningBoardOptions.demand) {
					registerSupplierListLoaded();
				}
				registerAssignmentListLoaded();
				registerSelectedAssignmentChanged();

				service.registerSelectionChanged = service.assignmentDataService.registerSelectionChanged;
				service.unregisterSelectionChanged = service.assignmentDataService.unregisterSelectionChanged;
			};

			// issue 133639
			function unshiftIfNotExists(arr, newElement) {
				if (_.isArray(arr) && newElement && newElement.id && !arr.some((e) => e.id === newElement.id)) {
					arr.splice(3, 0, newElement);
				}
			}

			service.setPlanningBoardScopeProperties = (planningBoardOptions, scope) => {
				if (planningBoardOptions && scope) {

					scope.supplierGridId = planningBoardOptions.supplier.uuid;

					if (!_.isNil(planningBoardOptions.demand)) {
						scope.demandGridId = planningBoardOptions.demand.uuid;
					}

					if (!_.isNil(planningBoardOptions.dateShift)) {
						scope.dateShiftConfig = planningBoardOptions.dateShift;
					}

					// toolbar config
					if (!_.isUndefined(planningBoardOptions.toolbarConfig)) {
						scope.toolbarConfig = planningBoardOptions.toolbarConfig;
						if (_.isFunction(scope.toolbarConfig.customTools)) {
							// async toolbar items
							scope.toolbarConfig.customTools(planningBoardOptions.uuid).then(function (tools) {
								if (_.isUndefined(scope.tools)) {
									scope.setTools({
										showImages: true,
										showTitles: true,
										cssClass: 'tools',
										items: tools
									});
								} else {
									if (_.isArray(tools)) {
										tools.forEach((e) => unshiftIfNotExists(scope.tools.items, e));
									} else {
										unshiftIfNotExists(scope.tools.items, tools);
									}
								}

								scope.tools.update();
							});
						}
					}

					scope.defaultFooterHeight = 40;
				}
				service.planningBoardMode = {
					'actionType': 'setDefault'
				};
				var uiAddOns = scope.getUiAddOns();
				busyOverlay = uiAddOns.getBusyOverlay();

				const demandMappingService = !!options.demandConfig && options.demandConfig.mappingService; // make sure that demand mapping service is set
				updatePlanningBoardSettings(planningBoardOptions.uuid, options.assignmentConfig.mappingService, demandMappingService);
			};

			service.setPlanningBoardConfiguration = function setPlanningBoardConfiguration(planningBoardOptions, scope) {
				setInitialValues();
				options.supplierConfig = planningBoardOptions.supplier;
				options.assignmentConfig = planningBoardOptions.assignment;

				scope.supplierGridId = options.supplierConfig.uuid;

				if (!_.isNil(planningBoardOptions.demand)) {
					options.demandConfig = planningBoardOptions.demand;
					scope.demandGridId = options.demandConfig.uuid;
				}

				scope.defaultFooterHeight = 40;

				var defaultConfigValues = platformPlanningBoardConfigService.getDefaultConfigValues();
				var assignmentMappingService = options.assignmentConfig.mappingService;

				// set custom config for the planning board
				if (_.isFunction(assignmentMappingService.manipulateDefaultConfigValues)) {
					var customConfigValues = assignmentMappingService.manipulateDefaultConfigValues(defaultConfigValues);
					platformPlanningBoardConfigService.setDefaultConfigValues(customConfigValues, planningBoardOptions.uuid);
				} else { // otherwise take general default config
					defaultConfigValues = platformPlanningBoardConfigService.getDefaultConfigValues();
					platformPlanningBoardConfigService.setDefaultConfigValues(defaultConfigValues, planningBoardOptions.uuid);
				}

				const demandMappingService = !!options.demandConfig && options.demandConfig.mappingService; // make sure that demand mapping service is set

				service.timeScaleDataService = planningBoardOptions.timeScale;
				service.supplierDataService = options.supplierConfig.dataService;
				if (!_.isNil(options.demandConfig)) {
					service.demandDataService = options.demandConfig.dataService;
				}
				service.assignmentDataService = options.assignmentConfig.dataService;

				// disable toolbarItems for those grids
				options.supplierConfig.toolbarItemsDisabled = true;
				options.supplierConfig.skipToolbarCreation = true;
				if (!_.isNil(options.demandConfig)) {
					options.demandConfig.toolbarItemsDisabled = true;
					options.demandConfig.skipToolbarCreation = true;
				}

				// optional dateshift
				if (!_.isNil(planningBoardOptions.dateShift)) {
					options.dateShiftConfig = planningBoardOptions.dateShift;
					scope.dateShiftConfig = options.dateShiftConfig;
				}

				// toolbar config
				if (!_.isUndefined(planningBoardOptions.toolbarConfig)) {
					scope.toolbarConfig = planningBoardOptions.toolbarConfig;
					if (_.isFunction(scope.toolbarConfig.customTools)) {
						// async toolbar items
						scope.toolbarConfig.customTools().then(function (tools) {
							if (_.isUndefined(scope.tools)) {
								scope.setTools({
									showImages: true,
									showTitles: true,
									cssClass: 'tools',
									items: tools
								});
							} else {
								if (_.isArray(tools)) {
									tools.forEach((e) => unshiftIfNotExists(scope.tools.items, e));
								} else {
									unshiftIfNotExists(scope.tools.items, tools);
								}
							}
							scope.tools.update();
						});
					}
				}
				updatePlanningBoardSettings(planningBoardOptions.uuid, options.assignmentConfig.mappingService, demandMappingService);
				service.registerSelectionChanged = service.assignmentDataService.registerSelectionChanged;
				service.unregisterSelectionChanged = service.assignmentDataService.unregisterSelectionChanged;

				if (service.assignmentDataService.getContainerData) {
					// turn off autosave on selection change in all planning boards!
					service.assignmentDataService.getContainerData().supportUpdateOnSelectionChanging = false;
				}
				if (service.assignmentDataService.getAccessRights) {
					 service.assignmentDataService.getAccessRights();
				}

				var uiAddOns = scope.getUiAddOns();
				busyOverlay = uiAddOns.getBusyOverlay();
				busyOverlay.setVisible(true);

				service.load();
				service.registerPlanningBoardEvents(planningBoardOptions);
			};

			function updatePlanningBoardSettings(uuid, assignmentMappingService, demandMappingService) {
				var configList = platformPlanningBoardConfigService.getConfigByUUID(uuid, assignmentMappingService, demandMappingService);

				options.planningBoardSettingsList = configList;
				if (!_getSettingValue('backgroundColorConfig')) {
					service.backgroundColorConfig();
				}

				// selected default zoom level
				if (!_.isUndefined(configList) && !_.isUndefined(configList[0].selectedZoomLevel)) {
					dateStart = moment().utc().startOf(configList[0].selectedZoomLevel.type);
					dateEnd = moment(dateStart).add(configList[0].selectedZoomLevel.value, configList[0].selectedZoomLevel.type);
					service.setCurrentZoomLevel(null, null, configList[0].selectedZoomLevel);
				}
				applyPlanningBoardSettings(configList);
			}


			service.onParentServiceUpdateDone = function onParentServiceUpdateDone() {
				assignmentMapInitialized = false;
				// clear modifications
				clearModifications();

				service.loadRest().then(function () {
					infoChangedMessenger.fire();
				});
			};

			function registerMainDataServiceReload() {
				findParentDataService(service.assignmentDataService);
				service.parentDataService.registerListLoaded(reloadPlanningBoard);
			}

			service.unregisterParentDataServiceListLoadStarted = function unregisterParentDataServiceListLoadStarted() {
				if (service.parentDataService) {
					service.parentDataService.unregisterListLoaded(reloadPlanningBoard);
				}
			};

			function findParentDataService(serv) {
				if (serv.parentService() === null) {
					service.parentDataService = serv;
				} else {
					findParentDataService(serv.parentService());
				}
			}

			function registerSupplierListLoaded() {
				// load the dependent data when supplierList changes
				service.supplierDataService.registerListLoaded(supplierListChanged);
			}

			service.unregisterSupplierListLoaded = function unregisterSupplierListLoaded() {
				// load the dependent data when supplierList changes
				service.supplierDataService.unregisterListLoaded(supplierListChanged);
			};

			function registerSelectedAssignmentChanged() {
				if (_.isFunction(service.assignmentDataService.registerSelectedAssignmentChanged)) {
					service.assignmentDataService.registerSelectedAssignmentChanged(service.planningBoardReDraw);
				}
			}

			service.unregisterSelectedAssignmentChanged = function unregisterSelectedAssignmentChanged() {
				if (_.isFunction(service.assignmentDataService.unregisterSelectedAssignmentChanged)) {
					service.assignmentDataService.unregisterSelectedAssignmentChanged(service.planningBoardReDraw);
				}
			};

			function registerAssignmentListLoaded() {
				service.assignmentDataService.registerListLoaded(service.planningBoardReDraw);
			}

			service.unregisterAssignmentListLoaded = function unregisterAssignmentListLoaded() {
				service.assignmentDataService.unregisterListLoaded(service.planningBoardReDraw);
			};

			// private
			function registerUpdateDone() {
				unRegisterFn = $rootScope.$on('updateDone', service.onParentServiceUpdateDone);
			}

			// public
			service.unregisterUpdateDone = function unregisterUpdateDone() {
				if (_.isFunction(unRegisterFn)) {
					unRegisterFn();
				}
			};

			function clearModifications() {
				service.assignments.clear();
				service.deletedAssignments.clear();
				platformDataServiceModificationTrackingExtension.clearModificationsInRoot(service.assignmentDataService);
			}

			function applyPlanningBoardSettings(configList) {
				options.supplierConfig.planningBoardSettingsList = configList;
				options.planningBoardSettingsList = configList;

			}

			function loadDemands(loadExtended, reloadAll) {
				var demandDateStart = moment(dateStart);
				var demandDateEnd = moment(dateEnd);
				if (loadExtended) {
					demandDateStart = demandDateStart.add(-4, 'week');
					demandDateEnd = demandDateEnd.add(4, 'week');
				}
				if (reloadAll || _.isUndefined(lastDemandDateStart) ||
					((lastDemandDateStart.diff(dateStart, 'days') > 0 || lastDemandDateEnd.diff(dateEnd, 'days') < 0)) ||
					extendedDemandsLoaded !== loadExtended) {
					lastDemandDateStart = demandDateStart;
					lastDemandDateEnd = demandDateEnd;
					extendedDemandsLoaded = loadExtended;
					service.demandDataService.setFilter({ From: demandDateStart.format(), To: demandDateEnd.format() });
					return service.demandDataService.load().then(function () {
						service.demands = service.demandDataService.getList();
					});
				} else {
					// no reload needed
					return $q.when();
				}
			}

			function onSettingsChanged(configList, uuid) {
				if (uuid === scope.getContainerUUID()) {
					if (!_.isNil(options.demandConfig) && extendedDemandsLoaded !== configList[0].showExtendedDemands) {
						loadDemands(configList[0].showExtendedDemands, true);
					}

					if (!_.isNil(options.planningBoardSettingsList)) {
						if (configList[0].selectedZoomLevel.id !== 'saveLastZoom' && options.planningBoardSettingsList[0].selectedZoomLevel.id !== configList[0].selectedZoomLevel.id) {
							service.setCurrentZoomLevel(null, null, configList[0].selectedZoomLevel);
							options.planningBoardSettingsList[0].saveLastZoom = configList[0].saveLastZoom;
							dateStart = dateStart.startOf(configList[0].selectedZoomLevel.type);
							dateEnd = moment(dateStart).add(configList[0].selectedZoomLevel.value, configList[0].selectedZoomLevel.type);
							service.planningBoardReDraw();
							service.loadRest();
						} else {
							options.planningBoardSettingsList[0].saveLastZoom = configList[0].saveLastZoom;
						}
					}
					applyPlanningBoardSettings(configList);

					platformGridAPI.grids.unregister(platformPlanningBoardTagGridConfigService.uuid);
				}
			}

			function calcFlexibleRowHeight(size = 1) {
				let gridHeight;
				if (size === 0) {
					return options.planningBoardSettingsList[0].rowHeight;
				}
				if (platformGridAPI.grids.getGridState(service.getSupplierConfig().uuid).viewportHeight === 0) {
					gridHeight = viewportHeightOnlyTmp === 0 ? scope.getCurrentDimensions().height : viewportHeightOnlyTmp;
				} else {
					gridHeight = platformGridAPI.grids.getGridState(service.getSupplierConfig().uuid).viewportHeight.height;
				}
				return Math.ceil(gridHeight / size) <= options.planningBoardSettingsList[0].rowHeight ? options.planningBoardSettingsList[0].rowHeight : Math.ceil(gridHeight / size);

			}

			function onSettingsChangedStarted(configList, uuid) {
				if (uuid === scope.getContainerUUID()) {
					switch (configList[0].selectedZoomLevel.id) {
						case 'onemonth':
							configList[0].selectedZoomLevel.value = 1;
							configList[0].selectedZoomLevel.type = 'month';
							break;
						case 'oneweek':
							configList[0].selectedZoomLevel.value = 1;
							configList[0].selectedZoomLevel.type = 'week';
							break;
						case 'twoweeks':
							configList[0].selectedZoomLevel.value = 2;
							configList[0].selectedZoomLevel.type = 'week';
							break;
						case 'saveLastZoom':
							configList[0].selectedZoomLevel.value = currentCalendarConfig.value;
							configList[0].selectedZoomLevel.type = currentCalendarConfig.type;
							break;
						default:
							configList[0].selectedZoomLevel.value = 1;
							configList[0].selectedZoomLevel.type = 'month';
							break;
					}
					viewportHeightOnlyTmp = platformGridAPI.grids.getGridState(service.getSupplierConfig().uuid).viewportHeight.height;
				}
			}

			platformPlanningBoardConfigService.registerOnSettingsChanged(onSettingsChanged);
			platformPlanningBoardConfigService.registerOnSettingsChangedStarted(onSettingsChangedStarted);

			service.registerOnSettingsChanged = platformPlanningBoardConfigService.registerOnSettingsChanged;
			service.unregisterOnSettingsChanged = platformPlanningBoardConfigService.unregisterOnSettingsChanged;

			service.registerOnSettingsChangedStarted = platformPlanningBoardConfigService.registerOnSettingsChangedStarted;
			service.unregisterOnSettingsChangedStarted = platformPlanningBoardConfigService.unregisterOnSettingsChangedStarted;

			service.getDateStart = function getDateStart(ds) {
				if (arguments.length) {
					dateStart = ds;
				}
				return dateStart;
			};

			service.getDateEnd = function getDateEnd(de) {
				if (arguments.length) {
					dateEnd = de;
				}
				return dateEnd;
			};

			service.loadCalendarOnly = function loadCalendarOnly(triggerChangesDoneEvent = false) {
				const supplierDataServ = service.getSupplierConfig()?.dataService;
				const supplierMapServ = service.getSupplierConfig() && service.getSupplierConfig().mappingService;

				let setCalendarInfoFn = (result) => {
					service.calendarInUse = result;
					service.exceptionDays = result.ExceptionDays;
					service.weekDays = result.WeekDays;
					if (triggerChangesDoneEvent) {
						infoChangedMessenger.fire();
					}

					return result;
				};

				const filteredSupplierList = supplierDataServ.getList ? supplierDataServ.getList() : [];

				if (filteredSupplierList.length > 0 && supplierMapServ && supplierMapServ.calendar) {
					let calendarIds = Array.from(new Set(filteredSupplierList.map(supplier => supplierMapServ.calendar(supplier))).values());

					if (service.getDateshiftConfig()) {
						// it is a promise but we don't need to wait for it to be finished
						service.getDateshiftConfig().dataService.loadCalendarsByIds(calendarIds);
					}

					return $q.when(platfromPlanningBoardCalendarService.getCalendarsByIds(service.getSupplierConfig().uuid, calendarIds, dateStart, dateEnd, triggerChangesDoneEvent).then(function (calendarMap) {
						let calOfFirstSupp = supplierMapServ.calendar(filteredSupplierList[0]);
						return setCalendarInfoFn(calendarMap.get(calOfFirstSupp));
					}));
				} else {
					// company calendar as default calendar
					return service.timeScaleDataService.getCalendarIdFromCompany().then(function getCalendarIdFromCompany(calendarId) {
						$q.when(platfromPlanningBoardCalendarService.getCalendarsByIds(service.getSupplierConfig().uuid, [calendarId], dateStart, dateEnd, triggerChangesDoneEvent).then(function (calendarMap) {
							return setCalendarInfoFn(calendarMap.get(calendarId));
						}));
					});
				}
			};

			service.loadRest = function loadRest(reloadAll) {
				var promiseList = [];

				// load lookupItems
				var statusSrv = options.assignmentConfig.mappingService.getStatusService();
				promiseList.push(statusSrv.getAssignmentStatus().then(function (list) {
					service.assignmentStatusItems = list;
					return service.assignmentStatusItems;
				}));

				var typeSrv = options.assignmentConfig.mappingService.getTypeService();
				promiseList.push(typeSrv.getAssignmentType().then(function (list) {
					service.assignmentTypeItems = list;
					return service.assignmentTypeItems;
				}));

				if (!assignmentMapInitialized) {
					promiseList.push(basicsUnitLookupDataService.getList({
						'lookupType': 'Uom',
						'dataServiceName': 'basicsUnitLookupDataService'
					}));


				}
				if (!assignmentMapInitialized || _.isUndefined(lastGridStartDate) || _.isUndefined(lastGridEndDate) ||
					lastGridStartDate.diff(dateStart, 'days') > 0 || lastGridEndDate.diff(dateEnd, 'days') < 0) {
					// load demands dependion on range settings
					if (!_.isNil(options.demandConfig)) {
						var reloadDemands = reloadAll;
						if (_.isNil(reloadAll)) {
							reloadDemands = true;
						}
						promiseList.push(loadDemands(service.showExtendedDemands(), reloadDemands));
					}
					// read assignments for 'extended range' (a bit out of sight) for horizontal scrolling or zooming
					// read visible days range/2 in both directions, but at least 5 +/-days more
					var readExtension = Math.max(5, (dateEnd.diff(dateStart, 'day')) / 2);
					lastGridStartDate = moment(dateStart).add(-readExtension, 'day');
					lastGridEndDate = moment(dateEnd).add(readExtension, 'days');
					service.assignmentDataService.setFilter({ From: lastGridStartDate.format(), To: lastGridEndDate.format() });
					if (_.isFunction(service.assignmentDataService.loadLinkedSupplierIds)) {
						return service.assignmentDataService.loadLinkedSupplierIds().then(function () {
							return assignmentDataPromise(promiseList, reloadAll);
						});
					} else {
						return assignmentDataPromise(promiseList, reloadAll);
					}
				} else {
					// no reload needed
					busyOverlay.setVisible(false);
					return $q.when();
				}
			};

			service.load = function load() {
				// initial load
				assignmentMapInitialized = false;
				service.loadCalendarOnly().then(function () {
					infoChangedMessenger.fire();
				});
				var items = service.supplierDataService.getList();
				busyOverlay.setVisible(true);
				return reloadPlanningBoard(items).then(function () {
					busyOverlay.setVisible(false);
					return $q.when();
				});
			};

			service.reloadPlanningBoardCalendar = function reloadPlanningBoardCalendar() {
				service.loadCalendarOnly().then(function () {
					if (!assignmentMapInitialized) {
						service.loadRest(true);
					} else {
						service.assignmentDataService.load().then(() => {
							return $q.resolve();
						});
					}
					infoChangedMessenger.fire();
				});
			};

			service.planningBoardReDraw = function planningBoardReDraw(redrawOnly, isHighlight = false) {
				if (!redrawOnly) {
					setAssignmentMap();
				}

				if (isHighlight) {
					infoChangedMessenger.fire(false, isHighlight);
				} else {
					infoChangedMessenger.fire();
				}


			};

			function assignmentDataPromise(promiseList, reloadAll) {
				promiseList.push(service.assignmentDataService.load().then(function () {
					// todo: this part is triggered with old asignments, eventlistender for listlaoded is already implemented, try to refactor
					setAssignmentMap(reloadAll);

					// optional disabled Assignments defined in assignment dataservice
					if (service.assignmentDataService.additionalAssignments && service.assignmentDataService.additionalAssignments.length > 0) {
						_.each(service.assignmentDataService.additionalAssignments, function (assignment) {
							if (!service.assignments.has(assignment.Id)) {
								assignment.ReservedFrom = moment(assignment.ReservedFrom);
								assignment.ReservedTo = moment(assignment.ReservedTo);
								service.assignments.set(assignment.Id, assignment);
							}
						});
					}

					/*
					// optionally set additional info fields 1-3 here by extending json object
					service.assignments.forEach(function (oldAssignment, key) {
						oldAssignment.InfoField1 = oldAssignment.Id;
					});
					*/
					if (service.getAssignmentConfig().mappingService.supplier && service.getAssignmentConfig().mappingService.grouping && service.getAssignmentConfig().mappingService.getSupplierCapacityPerDay) {
						let resourceIds = Array.from(service.assignments.values()).map(assignment => service.getAssignmentConfig().mappingService.supplier(assignment));
						service.getAssignmentConfig().mappingService.getSupplierCapacityPerDay(resourceIds, lastGridStartDate, lastGridEndDate).then(response => {
							service.supplierCapacityPerBaseUnit = {};
							for (let supplierId in response.data) {
								service.supplierCapacityPerBaseUnit[supplierId] = new Map();
								for (let day in response.data[supplierId]) {
									service.supplierCapacityPerBaseUnit[supplierId].set(moment(day).format('YYYY-MM-DD'), response.data[supplierId][day]);
								}
							}
							return $q.resolve();
						});
					} else {
						return $q.resolve();
					}

				}));

				return $q.all(promiseList).then(() => {
					// set the list of available statuses for retrived assignments
					if (_.isFunction(service.getAssignmentConfig().mappingService.entityTypeName)) {
						const assigmentArray = Array.from(service.assignments.values());
						let filteredAssignmentArray = new Map();
						assigmentArray.forEach((assignment) => {
							assignment.StatusFrom = assignment[options.assignmentConfig.mappingService.statusKey()];
							assignment.EntityId = {
								id: assignment.Id
							};
							if (!availableStatiMatrix) {
								if (!filteredAssignmentArray.has(assignment.StatusFrom)) {
									filteredAssignmentArray.set(assignment.StatusFrom, assignment);
								}
							} else {
								if (!availableStatiMatrix.has(assignment[options.assignmentConfig.mappingService.statusKey()])) {
									if (!filteredAssignmentArray.has(assignment.StatusFrom)) {
										filteredAssignmentArray.set(assignment.StatusFrom, assignment);
									}
								}
							}
						});

						return basicsCommonChangeStatusService.getAvailableStatusItems({
							StatusName: service.getAssignmentConfig().mappingService.entityTypeName(),
							DataItems: Array.from(filteredAssignmentArray.values())
						}).then(function (result) {
							if (result.status && result.status === 200) {
								result.data.DataItems.map(item => item.AvailableStatusIds === null ? item.AvailableStatusIds = [] : item.AvailableStatusIds);
								const availableStatiMatrix = createAvailableStatiMatrix(result.data.DataItems);
								service.assignmentAvailableStatusItems = availableStatiMatrix;

							}
							busyOverlay.setVisible(false);
							infoChangedMessenger.fire();
							return $q.resolve();
						});
					} else {
						busyOverlay.setVisible(false);
						infoChangedMessenger.fire();
						return $q.resolve();
					}
				});

				function createAvailableStatiMatrix(response) {
					if (!response) {
						return;
					}
					const statusFromIds = new Set();
					response.map(assignment => {
						statusFromIds.add(assignment.StatusFrom);
					});
					statusFromIds.forEach(status => {
						let isStatusAlreadyInMatrix = false;
						// check if status is already in matrix
						if (!availableStatiMatrix) {
							availableStatiMatrix = new Map();
							availableStatiMatrix.set(status, response.find(stati => stati.StatusFrom === status).AvailableStatusIds);
						} else {
							isStatusAlreadyInMatrix = availableStatiMatrix.has(status);
							if (isStatusAlreadyInMatrix) {
								availableStatiMatrix = availableStatiMatrix;
							} else {
								availableStatiMatrix.set(status, response.find(stati => stati.StatusFrom === status).AvailableStatusIds);
							}
						}
					});
					return availableStatiMatrix;
				}
			}

			function setAssignmentMap(reloadAll) {
				if (!assignmentMapInitialized) {
					assignmentMapInitialized = true;
				}
				var newLoadedAssignments = service.assignmentDataService.getList();
				service.assignments.forEach(function (oldAssignment, key) {
					if (reloadAll || !oldAssignment.pBoardModified) {
						service.assignments.delete(key);
					} else {
						service.assignmentDataService.markItemAsModified(oldAssignment);
					}
				});

				_.each(newLoadedAssignments, function (assignment) {
					if (!service.assignments.has(assignment.Id)) {
						service.assignments.set(assignment.Id, assignment);
						service.deletedAssignments.forEach(function (delAssignment, delId) {
							// delete assignment from map if it is already deleted
							if (delId === assignment.Id) {
								service.assignments.delete(delId);
							}
						});
					}
				});

				const assignmentMapServ = service.getAssignmentConfig().mappingService;
				const supplierMapServ = service.getSupplierConfig().mappingService;
				const supplierDataServ = service.getSupplierConfig().dataService;


				if (assignmentMapServ.calendar && supplierMapServ.calendar) {
					const calendarToSupplier = new Map(supplierDataServ.getList().map(sup => [supplierMapServ.id(sup), supplierMapServ.calendar(sup)]));
					newLoadedAssignments.forEach(nA => assignmentMapServ.calendar(nA, calendarToSupplier.get(assignmentMapServ.supplier(nA)), service));
				}
			}

			function reloadPlanningBoard(items) {
				// clear modifications
				clearModifications();

				if (!_.isArray(items)) {
					return $q.when();
				}

				if (items.length > 0) {
					assignmentMapInitialized = false;
					if (service.getSupplierConfig().dataService.getCalendarIdByFiltered) {
						return service.loadCalendarOnly().then(result => service.loadRest(true));
					} else {
						return service.loadRest(true);
					}
				} else {
					return $q.when(items);
				}
			}

			function supplierListChanged(items) {
				service.suppliers = service.supplierDataService.getList();
				// call service sub items reload instead of messenger fire - will be fired there
				if (_.isArray(items) && items.length > 0) { // if < 0 supplierListChanged was called from unload
					assignmentMapInitialized = false;
					service.loadRest(true);
				}
			}

			service.createAssignment = function createAssignment(demands, supplierId = 0, creationData) {
				if (options.dateShiftConfig) {
					// deactivates dateshift reset after creation, otherwise the dateshift reset will be fired for EVERY entity created
					options.dateShiftConfig.dataService.isMulticreationInProgress = true;
				}
				let assignmentMapService = options.assignmentConfig.mappingService;
				let demandMapService = options.demandConfig.mappingService;
				let supplierDataServ = options.supplierConfig?.dataService;
				let supplierMapService = options.supplierConfig?.mappingService;
				let assignments = [];
				let newAssignments = [];
				let promiseList = [];
				if (demandMapService) {
					demands.forEach(function (demand) {
						let assignment = {};
						assignments.push(assignment);
						let supplierOfDemand = demandMapService.supplier(demand); // the resourceFk in demand returned by mapping service. can it be used to retrieve supplier for this demand?
						assignmentMapService.supplier(assignment, supplierId);
						assignmentMapService.demand(assignment, demandMapService.id(demand));
						assignmentMapService.quantity(assignment, demandMapService.quantity(demand));
						assignmentMapService.unitOfMeasurement(assignment, demandMapService.unitOfMeasurement(demand));
						assignmentMapService.description(assignment, demandMapService.description(demand));
						if (_.isFunction(assignmentMapService.intersectSequence) && creationData.hasOwnProperty('intersectSequence')) {
							assignmentMapService.intersectSequence(assignment, creationData.intersectSequence);
						}

						if (_.isNull(creationData.to)) { // create assignment from
							let demandDate = demandMapService.from(demand);
							if (options.planningBoardSettingsList[0].useDemandTimesForReservation) {
								creationData.from = moment(demandDate);
							}

							let from = assignmentMapService.from(assignment, moment(creationData.from));

							from.hours(demandDate.hours());
							from.minutes(demandDate.minutes());
							from.seconds(demandDate.seconds());

							let minsLength = demandMapService.to(demand).diff(demandMapService.from(demand), 'minutes');
							assignmentMapService.to(assignment, moment(from).utc().add(minsLength, 'minutes'));
						} else { // create assignment with from to
							assignmentMapService.from(assignment, creationData.from);
							assignmentMapService.to(assignment, creationData.to);
						}

						assignmentMapService.demand(assignment, demand);
						assignment.dataService = service;

						const type = chartService.getZoomLevel(timeaxis);
						//get the supplier data
						let supplier = supplierDataServ?.getItemById?.(supplierId);
						let calendarId = null;
						if (supplier && supplierMapService?.calendar) {
							calendarId = supplierMapService.calendar(supplier);
						}
						let creationCalendarData = Object.assign(creationData, { type: type, calendarId: calendarId });

						if (_.isFunction(service.assignmentDataService.createItems)) {
							promiseList.push(service.assignmentDataService.createItems(assignment, service, creationCalendarData).then(function (multipleAssignments) {
								if (_.isFunction(assignmentMapService.createAssignments)) {

									newAssignments = assignmentMapService.createAssignments(
										assignment,
										multipleAssignments,
										creationCalendarData,
										service.getDateshiftConfig(),
										{
											useCustomPostCreation: _.isFunction(assignmentMapService.postAssignmentCreation)
										},
										service);

									newAssignments.forEach(function (newAssignment) {
										postAssignmentCreation(newAssignment);
									});
								}

								setTimeout(() => areCreatedNotVisible(newAssignments.map(nA => service.assignments.get(nA.Id))), 1000);
							}));
						} else {
							promiseList.push(service.assignmentDataService.createItem(assignment, service).then(function (newAssignment) {
								newAssignment = assignmentMapService.createAssignment(
									assignment,
									newAssignment,
									creationCalendarData,
									service.getDateshiftConfig(),
									{
										useCustomPostCreation: _.isFunction(assignmentMapService.postAssignmentCreation)
									},
									service);
								postAssignmentCreation(newAssignment);

								setTimeout(() => areCreatedNotVisible([newAssignment].map(nA => service.assignments.get(nA.Id))), 1000);
							}));
						}

						function postAssignmentCreation(newAssignment) {
							assignmentMapService.validateAssignment(newAssignment, service.assignmentDataService);
							newAssignment.pBoardModified = true;
							if (!service.assignments.get(newAssignment.Id)) {
								service.assignments.set(newAssignment.Id, newAssignment);
								if (!newAssignments.includes(newAssignment)) {
									newAssignments.push(newAssignment);
								}
							} else {
								service.updateAssignment(newAssignment);
							}
						}

						function areCreatedNotVisible(createdItems) {

							let earliestStart = moment.utc(createdItems.map(createdItem => assignmentMapService.from(createdItem).toDate().getTime()).sort().at(0));
							let latestEnd = moment.utc(createdItems.map(createdItem => assignmentMapService.to(createdItem).toDate().getTime()).sort().at(-1));

							if (earliestStart.isAfter(service.getDateEnd()) || latestEnd.isBefore(service.getDateStart())) {
								let timer = 3000;
								const toastTemplate = `
								<div class="alarm-overlay not-visible-message">
									<div class="alert" role="alert" style="text-align:center">
									${($translate.instant('platform.planningboard.createdDateMsg'))
									.replace('${0}',earliestStart.format(`dddd DD, MMMM yyyy, hh:mm${earliestStart.seconds() > 0 ? ':ss' : ''}`))}
									<p class="timer">(${timer/1000}s)<p>
									</div>
								</div>`;

								let toastElem = ((new DOMParser).parseFromString(toastTemplate, 'text/html')).getElementsByClassName('not-visible-message')[0];
								let timerElem = toastElem.getElementsByClassName('timer')[0];

								toastElem.firstElementChild.addEventListener('click', (event) => {
									service.calendarSnapToDate(earliestStart);
								});

								let activeElem = document.getElementsByTagName('body')[0].appendChild(toastElem);

								if (activeElem !== toastElem) {
									activeElem.appendChild(toastElem);
								}

								let timerInterval = setInterval(() => {
									timer-= 1000;
									timerElem.innerHTML = `(${timer/1000}s)`;
								}, 1000)

								setTimeout(() => {
									clearInterval(timerInterval);
									toastElem.remove();
								}, timer);
							}
						}
					});
				}

				return $q.all(promiseList).then(() => {
					if (options.dateShiftConfig) {
						options.dateShiftConfig.dataService.isMulticreationInProgress = false;
						// add created assignments to virtual entities
						options.dateShiftConfig.dataService.mergeChangedVirtualData(newAssignments, options.dateShiftConfig.entityName);
						options.dateShiftConfig.dateShiftHelperService.resetDateshift(options.dateShiftConfig.dataService.getServiceName());

						if (options.assignmentConfig.mappingService.postAssignmentCreation && !creationData.intersectSequence) {
							options.assignmentConfig.mappingService.postAssignmentCreation(newAssignments, creationData, service, options.dateShiftConfig);
							options.dateShiftConfig.dataService.mergeChangedVirtualData(newAssignments, options.dateShiftConfig.entityName);
							options.dateShiftConfig.dateShiftHelperService.resetDateshift(options.dateShiftConfig.dataService.getServiceName());
						}

						options.dateShiftConfig.dateShiftHelperService.updateSequenceData(options.dateShiftConfig.dataService.getServiceName());
					}

					infoChangedMessenger.fire();

				});
			};

			service.updateAssignment = function updateAssignment(assignment) {
				service.assignments.set(assignment.Id, assignment);
				var assignmentToUpdate = service.assignments.get(assignment.Id);
				assignmentToUpdate.pBoardModified = true;
				service.assignmentDataService.markItemAsModified(assignmentToUpdate);
			};

			service.updateAssignments = function updateAssignments(assignments) {
				assignments.forEach((value) => {
					service.updateAssignment(value);
				});
				service.planningBoardReDraw(true);
			};

			service.setSelectedAssignment = function setSelectedAssignment(assignment) {
				service.assignmentDataService.setSelected(assignment);
			};

			service.addToSelectedAssignment = function addToSelectedAssignment(assignment) {
				if (assignment) {
					var oldSelItems = service.assignmentDataService.getSelectedEntities();
					if (!oldSelItems || oldSelItems.length === 0) {
						service.assignmentDataService.setSelected(assignment);
					} else {
						var newSelItems = [];
						var alreadyContained = false;
						_.forEach(oldSelItems, function (i) {
							if (i.Id === assignment.Id) {
								alreadyContained = true;
							}
							else {
								newSelItems.push(i);
							}
						});
						if (!alreadyContained) {
							newSelItems.push(assignment);
						}
						service.assignmentDataService.setSelectedEntities(newSelItems);
					}
				} else {
					service.assignmentDataService.setSelected(null, []);
				}
			};

			service.deleteSelectedAssignment = function deleteSelectedAssignment() {
				const selItems = service.assignmentDataService.getSelectedEntities();
				const mapService = options.assignmentConfig.mappingService;
				const demandMapService = options.demandConfig.mappingService;
				const assignments = Array.from(service.assignments.values());
				let deletionSucceded = true;
				let deleteDeniedText = 'Selected item(s) cannot be deleted';

				// Set up a promise to ensure the deletion proceeds even if updateDemandGrid is not called
				let updateDemandGridPromise = Promise.resolve();

				// Check if updateDemandGrid should be called
				if (_.isFunction(demandMapService.updateDemandGrid)) {
					 let itemIds = selItems.map(item => item.ItemId);
					 let demands = service.demandDataService.getList() ? service.demandDataService.getList() : [];

					 // Check if the missign demand id  exist
					 const missingDemandId = itemIds.filter(id => !demands.some(obj => obj.Id === id));
					 if (missingDemandId.length > 0) {
						  // Call updateDemandGrid and update the promise to wait for it
						  updateDemandGridPromise = demandMapService.updateDemandGrid(itemIds, service.demandDataService);
					 }
				}

				// Wait for updateDemandGrid to complete (if it was called), and then process the deletion
				return updateDemandGridPromise
					.then(() => {
						selItems.forEach(item => {

							if (_.isFunction(mapService.canDelete) && !mapService.canDelete(item, assignments, options.dateShiftConfig) ||
								_.isFunction(mapService.isReadOnly) && mapService.isReadOnly(item)) {

								if (_.isFunction(mapService.getDeniedDeleteMessage)) {
									deleteDeniedText = mapService.getDeniedDeleteMessage();
								}

								scope.getUiAddOns().getAlarm().show(deleteDeniedText);
								deletionSucceded = false;
								return deletionSucceded;
							}

							service.assignments.delete(item.Id);
							service.deletedAssignments.set(item.Id, item);
						});

						if (deletionSucceded) {
							if (platformObjectHelper.isPromise(service.assignmentDataService.deleteSelection)) {
								service.assignmentDataService.deleteSelection().then(() => {
									service.assignmentDataService.setSelected(null, []);
									infoChangedMessenger.fire();
									return deletionSucceded;
								});
							} else {
								service.assignmentDataService.deleteSelection(options.dateShiftConfig);
								service.assignmentDataService.setSelected(null, []);
								infoChangedMessenger.fire();
								return deletionSucceded;
							}
						}
						return deletionSucceded;
				});


			};

			service.updateDemand = function updateDemand(demand) {
				service.demandDataService.markItemAsModified(demand);
				service.demandDataService.update();
			};

			// DEPRECATED
			// service.decDate = function decDate(decBy) {
			// 	dateStart = dateStart.subtract(decBy, 'day');
			// 	dateEnd = dateEnd.subtract(decBy, 'day');
			// 	service.loadRest();
			// };

			// region calendar functions
			service.isCalendarLocked = (isLocked) => {
				if (!_.isNil(isLocked)) {
					isCalendarLocked = isLocked;
				}
				return isCalendarLocked;
			};

			service.clickToday = function clickToday() {
				var hourDiff = dateEnd.diff(dateStart, 'hour');
				dateStart = moment().utc().startOf('day');
				if (hourDiff > 10 * 24) {
					dateStart.subtract(1, 'weeks');
				} else if (hourDiff > 2 * 24) {
					dateStart.subtract(1, 'days');
				} else {
					dateStart.subtract(12, 'hours');
				}
				dateEnd = moment(dateStart).add(hourDiff, 'hour');
				busyOverlay.setVisible(true);
				service.loadRest().then(() => {
					service.planningBoardReDraw(true);
				});
			};

			// DEPRECATED
			// service.incDate = function incDate(incBy) {
			// 	dateStart = dateStart.add(incBy, 'day');
			// 	dateEnd = dateEnd.add(incBy, 'day');
			// 	service.loadRest();
			// };

			service.getTimeScaleHoursX = function getTimeScaleHoursX() {
				var hoursX = 0;
				var dayDiff = dateEnd.diff(dateStart, 'day');
				if (dayDiff <= 2) {
					hoursX = 1;
				} else if (dayDiff <= 4) {
					hoursX = 3;
				} else if (dayDiff <= 7) {
					hoursX = 6;
				} else if (dayDiff <= 21) {
					hoursX = 12;
				} else {
					hoursX = 24;
				}
				return hoursX;
			};

			/**
			 * @ngdoc function
			 * @name setCurrentZoomLevel
			 * @description Sets the current zoom level configuration of planning board
			 *
			 * @param startDate
			 * @param endDate
			 * @param config
			 * @return {boolean}
			 */
			service.setCurrentZoomLevel = function setCurrentZoomLevel(startDate, endDate, config = null) {
				if (service.isCalendarLocked()) {
					return false;
				}
				const currentZoomLevel = config && config.type ? config.type : chartService.getZoomLevel(timeaxis);
				const value = config && config.value ? config.value : endDate.diff(startDate, currentZoomLevel);
				const id = config && config.id ? config.id : options.planningBoardSettingsList[0].selectedZoomLevel.id;
				currentCalendarConfig = { caption: 'customZoom', value: value, type: currentZoomLevel, id: id };
				if (!_.isNil(options.planningBoardSettingsList) && !_.isUndefined(options.planningBoardSettingsList[0].selectedZoomLevel)) {
					options.planningBoardSettingsList[0].selectedZoomLevel = currentCalendarConfig;
				}
				return true;
			};

			/**
			 * @ngdoc function
			 * @name saveCurrentZoomLevel
			 * @description saves the current zoom level of planning board by saving the planning board config
			 */
			service.saveCurrentZoomLevel = function saveCurrentZoomLevel() {
				if (service.isCalendarLocked()) {
					return false;
				}

				if (options.planningBoardSettingsList[0].saveLastZoom) {
					platformPlanningBoardConfigService.prepareCustomDataAndSaveSettings(service.getPlanningBoardSettingsList(), platformPlanningBoardConfigService.getUUID(), true);
				}
			};

			/**
			 * @ngdoc function
			 * @name zoomIn
			 * @description zoom in on zoomIn toolbar button in planning board
			 */
			service.zoomIn = function zoomIn() {
				if (service.isCalendarLocked()) {
					return false;
				}

				var dayDiff = dateEnd.diff(dateStart, 'day');
				if (dayDiff >= 2) {
					var zoomStep = service.getTimeScaleHoursX() * 4;
					dateStart = dateStart.add(zoomStep, 'hour');
					dateEnd = dateEnd.add(-zoomStep, 'hour');
					service.setCurrentZoomLevel(dateStart, dateEnd);
					service.saveCurrentZoomLevel();
					clearTimeout(OnZoomTimeOut);
					OnZoomTimeOut = setTimeout(service.planningBoardReDraw(), msZoomTimeOut);
				}
			};

			/**
			 * @ngdoc function
			 * @name zoomReset
			 * @description sets/resets the zoom level on zoomReset toolbar button in planning board according to the parameters
			 * @param {int} value
			 * @param {String} type
			 */
			service.zoomReset = function zoomReset(value, type) {
				if (service.isCalendarLocked()) {
					return false;
				}

				dateStart = dateStart.startOf(type);
				dateEnd = moment(dateStart).add(value, type);
				service.setCurrentZoomLevel(dateStart, dateEnd, { type: type, value: value });
				if (assignmentMapInitialized) {
					service.saveCurrentZoomLevel();
				}
				clearTimeout(OnZoomTimeOut);
				OnZoomTimeOut = setTimeout(() => service.planningBoardReDraw(), msZoomTimeOut);
				service.loadRest();
			};

			/**
			 * @ngdoc function
			 * @name zoomOut
			 * @description zoom out on zoomOut toolbar button in planning board
			 */
			service.zoomOut = function zoomOut() {
				if (service.isCalendarLocked()) {
					return false;
				}

				var zoomStep = service.getTimeScaleHoursX() * 4;
				dateStart = dateStart.add(-zoomStep, 'hour');
				dateEnd = dateEnd.add(zoomStep, 'hour');
				service.setCurrentZoomLevel(dateStart, dateEnd);
				service.saveCurrentZoomLevel();

				clearTimeout(OnZoomTimeOut);
				OnZoomTimeOut = setTimeout(() => service.planningBoardReDraw(), msZoomTimeOut);
				service.loadRest();
			};

			service.calendarSnapToDate = (date) => {
				if (service.isCalendarLocked()) {
					return false;
				}

				let startEndDiff = dateEnd.diff(dateStart, 'hour');
				dateStart = moment(moment.duration(date).asMilliseconds()).utc();
				dateEnd = moment(dateStart).add(startEndDiff, 'hour');
				service.setCurrentZoomLevel(dateStart, dateEnd);
				service.saveCurrentZoomLevel();
				clearTimeout(OnZoomTimeOut);
				OnZoomTimeOut = setTimeout(() => service.planningBoardReDraw(), msZoomTimeOut);
				service.loadRest();
			};

			// endregion

			service.registerInfoChanged = function registerInfoChanged(handler) {
				infoChangedMessenger.register(handler);
			};

			service.unregisterInfoChanged = function unregisterInfoChanged(handler) {
				infoChangedMessenger.unregister(handler);
			};

			service.getSupplierConfig = function getSupplierConfig() {
				return options.supplierConfig;
			};

			service.getAssignmentConfig = function getAssignmentConfig() {
				return options.assignmentConfig;
			};

			service.getDemandConfig = function getDemandConfig() {
				return options.demandConfig;
			};

			service.getDateshiftConfig = function getDateshiftConfig() {
				return options.dateShiftConfig;
			};


			service.getDemandDraggingInfo = function getDemandDraggingInfo() {
				return _getSettingValue('showDemandPreview');
			};

			service.showHeaderColor = function showHeaderColor() {
				return _getSettingValue('showHeaderColor');
			};

			service.showStatusIcon = function showStatusIcon() {
				return _getSettingValue('showStatusIcon');
			};

			service.showInTransportIcon = function showInTransportIcon() {
				return _getSettingValue('showInTransportIcon');
			};

			service.backgroundColorConfig = function backgroundColorConfig() {
				let defaultConfig = platformPlanningBoardConfigService.getDefaultConfigValues(options.uuid);
				defaultConfig = Object.values(defaultConfig).reduce(((r, c) => Object.assign(r, c)), {}).backgroundColorConfig;
				if (!service.getPlanningBoardSettingsList().reduce(((r, c) => Object.assign(r, c)), {})['backgroundColorConfig']) {
					let inUseStatusAsBg = _getSettingValue('showStatusAsBGColor');
					delete options.planningBoardSettingsList[0].showStatusAsBGColor;
					if (inUseStatusAsBg) {
						defaultConfig = { value: 'status', id: 'statuscolor', caption: $translate.instant('platform.planningboard.backgroundColorConfig.status') };
					}
					options.planningBoardSettingsList[0].backgroundColorConfig = defaultConfig;
				}
				return _getSettingValue('backgroundColorConfig');
			};

			service.showTypeIcon = function showTypeIcon() {
				return _getSettingValue('showTypeIcon');
			};

			service.ignoreIsFullyCovered = function ignoreIsFullyCovered() {
				return _getSettingValue('ignoreIsFullyCovered');
			};

			service.ignoreIsNotFullyCovered = function ignoreIsNotFullyCovered() {
				return _getSettingValue('ignoreIsNotFullyCovered');
			};

			service.showHeaderBackground = function showHeaderBackground() {
				return _getSettingValue('showHeaderBackground');
			};

			service.showSameAssignments = function showSameAssignments() {
				return _getSettingValue('showSameAssignments');
			};

			service.showMainText = function showMainText() {
				return _getSettingValue('showMainText');
			};

			service.showInfo1Text = function showInfo1Text() {
				return _getSettingValue('showInfo1Text');
			};

			service.showInfo2Text = function showInfo2Text() {
				return _getSettingValue('showInfo2Text');
			};

			service.showInfo3Text = function showInfo3Text() {
				return _getSettingValue('showInfo3Text');
			};

			service.mainInfoLabel = function mainInfoLabel() {
				return _getSettingValue('mainInfoLabel');
			};

			service.info1Label = function info1Label() {
				return _getSettingValue('info1Label');
			};

			service.info2Label = function info2Label() {
				return _getSettingValue('info2Label');
			};

			service.info3Label = function info3Label() {
				return _getSettingValue('info3Label');
			};

			service.snapToDays = function snapToDays() {
				return _getSettingValue('snapToDays');
			};

			service.showExtendedDemands = function showExtendedDemands() {
				return _getSettingValue('showExtendedDemands');
			};

			service.validateAssignments = function validateAssignments() {
				return _getSettingValue('validateAssignments');
			};

			service.useMinAggregation = function useMinAggregation() {
				return _getSettingValue('useMinAggregation');
			};

			service.showAggregations = function showAggregations() {
				return _getSettingValue('showAggregations');
			};

			service.showSumAggregations = function showSumAggregations() {
				return _getSettingValue('showSumAggregations');
			};

			service.useTaggingSystem = function useTaggingSystem() {
				return _getSettingValue('useTaggingSystem');
			};

			service.tagConfig = function tagConfig() {
				return _getSettingValue('tagConfig', 'id');
			};

			service.collectionConfig = function collectionConfig() {
				return _getSettingValue('collectionConfig');
			};

			service.aggregationTrafficLightsConfig = function aggregationTrafficLightsConfig() {
				return _getSettingValue('aggregationTrafficLightsConfig');
			};

			service.aggregationTrafficLightsValuesConfig = function aggregationTrafficLightsValuesConfig() {
				return _getSettingValue('aggregationTrafficLightsValuesConfig');
			};

			service.saveLastZoom = function saveLastZoom() {
				return _getSettingValue('saveLastZoom');
			};

			service.useDemandTimesForReservation = function useDemandTimesForReservation() {
				return _getSettingValue('useDemandTimesForReservation');
			};

			service.selectedZoomLevel = function selectedZoomLevel() {
				return _getSettingValue('selectedZoomLevel');
			};
			service.minAggregationLevel = function minAggregationLevel() {
				return _getSettingValue('minAggregationLevel');
			};

			service.sumAggregationLine1 = () => {
				return _getSettingValue('sumAggregationLine1');
			};

			service.sumAggregationLine2 = () => {
				return _getSettingValue('sumAggregationLine2');
			};

			service.sumAggregationLine3 = () => {
				return _getSettingValue('sumAggregationLine3');
			};

			service.useFixedAssignmentHeight = () => {
				return _getSettingValue('useFixedAssignmentHeight');
			};

			service.rowHeight = () => {
				if (service.useFlexibleRowHeight()) {
					return calcFlexibleRowHeight(service.supplierDataService.getList().length);
				}
				return _getSettingValue('rowHeight');
			};

			service.rowHeightAssignments = () => {
				if (service.showAggregations()) {
					return service.rowHeight() - defaultAggregationHeight;
				}
				return service.rowHeight();
			};

			service.getRowHeightFromSettings = function getRowHeightFromSettings() {
				return service.rowHeight();
			};

			service.useFlexibleRowHeight = function useFlexibleRowHeight() {
				return _getSettingValue('useFlexibleRowHeight');
			};

			service.reloadOnChangeFullyCovered = () => {
				return _getSettingValue('reloadOnChangeFullyCovered');
			};
			service.defaultAggregationHeight = () => {
				return defaultAggregationHeight;
			};

			service.gridSettings = [];
			service.gridSettings.validateDemandAgainstSuppliers = function validateDemandAgainstSuppliers() {
				return _getSettingValue('validateDemandAgainstSuppliers');
			};


			service.gridSettings.filterDemands = function filterDemands() {
				return _getSettingValue('filterDemands');
			};

			service.verticalIndex = (value) => {
				if (value) {
					verticalIndex = value;
				}
				return verticalIndex;
			};

			service.getCurrentDimensions = (value) => {
				if (value) {
					currentDimensions = value;
				}
				return currentDimensions;
			};

			// service.gridSettings.validateDemandsAgainstSupplier = function validateDemandsAgainstSupplier() {
			// 	return _getSettingValue(false, 'validateDemandsAgainstSupplier', 1);
			// };

			service.canDeleteAssignment = function canDeleteAssignment() {
				let mapService = options.assignmentConfig.mappingService;
				let canDelete = false;
				if (_.isFunction(mapService.isReadOnly)) {
					_.forEach(service.assignmentDataService.getSelectedEntities(), (selectedEntity) => {
						if (!mapService.isReadOnly(selectedEntity)) {
							canDelete = true;
							if (_.isFunction(mapService.canDelete)) {
								canDelete = mapService.canDelete(selectedEntity);
							}
						}
					});
				} else {
					canDelete = true;
				}
				return canDelete && service.assignmentDataService.getSelectedEntities().length > 0;
			};

			service.setTimeAxis = (value) => {
				timeaxis = value;
			};

			service.getPlanningBoardSettingsList = () => {
				return options.planningBoardSettingsList;
			};

			function _getSettingValue(key) {
				var list = service.getPlanningBoardSettingsList();

				const flatSettingList = new Map(Object.entries(...list));

				if (flatSettingList.has(key)) {
					return flatSettingList.get(key);
				} else {
					return false;
				}
			}

			function checkSetting(list, keyParts) {

				// todo change this! gridsettings come in first index
				if (keyParts.length > 1) {
					var nextKey = keyParts[0];
					keyParts.splice(0, 1);
					if (list.hasOwnProperty(nextKey)) {
						checkSetting(list[nextKey], keyParts);
					} else {
						return false;
					}
				} else {
					if (list.hasOwnProperty(keyParts[0])) {
						return list[keyParts[0]];
					} else {
						return false;
					}
				}
			}

			service.loadVirtualForSelected = (selectedAsssignment) => {
				const dateShiftConfig = service.getDateshiftConfig();

				if (!_.isNil(dateShiftConfig)) {
					const entityName = dateShiftConfig.entityName;
					const leadingRegistration = dateShiftConfig.dataService.getContainerData().registeredServices[entityName].find(x => x.serviceContainer.service === service.getAssignmentConfig().dataService);
					const selectedAssignments = [selectedAsssignment];
					const foundVirtualIds = new Set(dateShiftConfig.dataService.findVirtualEntities(selectedAssignments, entityName).map(fv => fv.Id));
					const virtualToLoadIds = selectedAssignments.filter(assignment => !foundVirtualIds.has(assignment.Id)).map(assignment => assignment.Id);

					if (virtualToLoadIds.length > 0) {
						return dateShiftConfig.dataService.loadVirtualEntities({
							mainItemIds: virtualToLoadIds,
							entity: entityName,
							foreignKey: leadingRegistration.config.match ? leadingRegistration.config.match : 'Id',
							triggerEntityName: leadingRegistration.serviceContainer.data.itemName
						}).then(() => {
							dateShiftConfig.dateShiftHelperService.resetDateshift(dateShiftConfig.dataService.getServiceName())
						});
					}
				}

				return $q.when(false);
			};

			service.setPlanningBoardConfiguration(pbsettings, scope);

			return service;
		};
	}
})(angular);