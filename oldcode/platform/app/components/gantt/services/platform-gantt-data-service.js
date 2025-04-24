(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformGanttDataService', PlatformGanttDataService);

	PlatformGanttDataService.$inject = ['$q', '$rootScope', '$injector', '_', 'moment', '$timeout', 'PlatformMessenger'];

	function PlatformGanttDataService($q, $rootScope, $injector, _, moment, $timeout, PlatformMessenger) {

		var service = this;

		var relationsLoading = false;
		var infoChangedMessenger = new PlatformMessenger();
		var unRegisterFn = _.noop;
		var _scope = false;
		service.leftGridData = [];
		service.dateShiftHelperService = false;
		service.leftGridDataService = false;
		service.relationService = false;
		service.leftGridMappingService = false;

		var options = {
			leftGridConfig: null
		};

		service.setGanttConfig = function setGanttConfig(ganttOptions, scope) {
			_scope = scope;
			scope.toolsConfig = ganttOptions.toolsConfig;
			options.leftGridConfig = ganttOptions.leftGrid;
			scope.leftGridId = options.leftGridConfig.uuid;
			scope.dateShiftHelperService = options.leftGridConfig.dateShiftHelperService;
			scope.leftGridDataService = options.leftGridConfig.dataService;
			scope.leftGridMappingService = options.leftGridConfig.mappingService;
			scope.dateshiftConfig = options.leftGridConfig.dateshiftConfig || {};
			scope.onUpdateDone = infoChangedMessenger;
			scope.selectedIds = [];
			scope.leftGridData = [];

			service.leftGridDataService = options.leftGridConfig.dataService;
			service.dateShiftHelperService = options.leftGridConfig.dateShiftHelperService;
			service.relationService = options.leftGridConfig.relationService;
			service.leftGridMappingService = options.leftGridConfig.mappingService;

			service.leftGridDataService.scrolling = infoChangedMessenger; // event bind scrolling
			service.leftGridDataService.ganttDataLoaded = infoChangedMessenger;

			scope.timeRange = setTimeRanges(service.leftGridDataService.getList());
			scope.timeRangeLimit = ganttOptions.leftGrid.settings.timeRangeLimit;
			scope.snapToDay = ganttOptions.leftGrid.settings.snapToDay;
			scope.snapToSmallestUnit = ganttOptions.leftGrid.settings.snapToSmallestUnit;

			// register events
			registerUpdateDone();
			registerSelectionChanged();
			registerLeftGridDataServiceListLoaded();
			registerItemModified();

			reloadGanttData();
		};

		service.load = function load(event) {
			reloadGanttData();
		};

		let delayTimeout;

		function reloadGanttDataDelayed() {
			clearTimeout(delayTimeout);
			delayTimeout = setTimeout(() => {
				reloadGanttData();
			}, 1);
		}

		function reloadGanttData() {
			if (_scope.isMoving) {
				// don't reload gantt data while user is dragging
				return;
			}

			service.leftGridData = service.leftGridDataService.getList();
			_scope.leftGridData = service.leftGridDataService.getList();
			_scope.orgiginalLeftGridData = JSON.parse(JSON.stringify(service.leftGridDataService.getList()));
			_scope.deltaX = 0;

			_.forEach(_scope.orgiginalLeftGridData, function (data) {
				// convert strings to moment
				data.PlannedFinish = moment(data.PlannedFinish);
				data.PlannedStart = moment(data.PlannedStart);
			});

			service.leftGridDataService.originalActivities = _scope.orgiginalLeftGridData;
			_scope.itemList = service.leftGridMappingService.mapElements(_scope.leftGridData);
			if (!_.isUndefined(service.relationService) && _scope.itemList[0].length > 0) {
				if (!relationsLoading) {
					relationsLoading = true;
					service.relationService.load().then(function () {
						service.leftGridDataService.relations = _.cloneDeep(service.relationService.getList());
						_scope.relationshipList = service.leftGridMappingService.mapRelationships(service.relationService.getList(), service.leftGridData);
						_scope.unmappedRelationshipList = _.cloneDeep(service.relationService.getList());
						service.leftGridDataService.ganttDataLoaded.fire();
						relationsLoading = false;
					});
				}
			} else {
				_scope.unmappedRelationshipList = [];
				_scope.relationshipList = [];
				service.leftGridDataService.ganttDataLoaded.fire();
			}

			_scope.timeRange = setTimeRanges(service.leftGridDataService.getList()); // update time ranges
		}

		function setTimeRanges(data) {
			var timeRange = {start: null, end: null};
			_.forEach(data, function (element) {
				timeRange.start = (_.isNull(timeRange.start) || moment(moment(element.PlannedStart).add(-10, 'days')).isBefore(timeRange.start)) ? moment(element.PlannedStart).add(-10, 'days') : timeRange.start;
				timeRange.end = (_.isNull(timeRange.end) || moment(moment(element.PlannedFinish).add(10, 'days')).isAfter(timeRange.end)) ? moment(element.PlannedFinish).add(10, 'days') : timeRange.end;
			});

			if (_.isNull(timeRange.start) || _.isNull(timeRange.end)) {
				timeRange.start = moment().add(-1, 'months');
				timeRange.end = moment().add(1, 'months');
			}

			return timeRange;
		}

		function registerLeftGridDataServiceListLoaded() {
			service.leftGridDataService.registerListLoaded(service.load);
		}

		service.unregisterLeftGridDataServiceListLoaded = function unregisterLeftGridDataServiceListLoaded() {
			service.leftGridDataService.unregisterLeftGridDataServiceListLoaded(service.load);
		};

		function registerItemModified() {
			service.leftGridDataService.registerItemModified(reloadGanttDataDelayed);
		}

		service.unregisterItemModified = function unregisterItemModified() {
			service.leftGridDataService.unregisterItemModified(reloadGanttDataDelayed);
		};

		function registerSelectionChanged() {
			service.leftGridDataService.registerSelectedEntitiesChanged(setSelectedIds);
		}

		service.unregisterSelectedEntitiesChanged = function unregisterSelectedEntitiesChanged() {
			service.leftGridDataService.unregisterSelectedEntitiesChanged(setSelectedIds);
		};

		function setSelectedIds() {
			_scope.selectedIds = _.map(_scope.leftGridDataService.getSelectedEntities(), 'Id');
			infoChangedMessenger.fire();
		}

		service.getLeftGridConfig = function getLeftGridConfig() {
			return options.leftGridConfig;
		};

		function registerUpdateDone() {
			unRegisterFn = $rootScope.$on('updateDone', service.onUpdateDone);
		}

		service.unregisterUpdateDone = function unregisterUpdateDone() {
			if (_.isFunction(unRegisterFn)) {
				unRegisterFn();
			}
		};

		service.onUpdateDone = function onUpdateDone() {
			// reloadGanttData();
			infoChangedMessenger.fire();
		};

		// info messenger events
		service.registerInfoChanged = function registerInfoChanged(handler) {
			infoChangedMessenger.register(handler);
		};

		service.unregisterInfoChanged = function unregisterInfoChanged(handler) {
			infoChangedMessenger.unregister(handler);
		};
	}
})(angular);
