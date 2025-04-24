/*
 * $Id: scheduling-main-simulated-gantt-data-service.js 634480 2021-04-28 12:48:05Z sprotte $
 * Copyright (c) RIB Software SE
 */

/* global d3 */
// This file uses D3 v4.
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling.main.schedulingMainSimulatedGanttDataService
	 * @function
	 * @requires _, moment, modelSimulationMasterService, $translate, $http, modelChangeSetDataService,
	 *           PlatformMessenger, platformNiceNameService, schedulingMainActivityStandardConfigurationService,
	 *           platformModalFormConfigService, schedulingMainService, modelViewerModelSelectionService
	 *
	 * @description Manages the data for the simulated Gantt chart.
	 */
	angular.module('scheduling.main').factory('schedulingMainSimulatedGanttDataService', ['_', 'moment',
		'modelSimulationMasterService', '$translate', '$http',
		'modelChangeSetDataService', 'PlatformMessenger', 'platformNiceNameService',
		'schedulingMainActivityStandardConfigurationService', 'platformModalFormConfigService', 'schedulingMainService',
		'modelViewerModelSelectionService',
		function (_, moment, modelSimulationMasterService, $translate, $http, modelChangeSetDataService,
			PlatformMessenger, platformNiceNameService, schedulingMainActivityStandardConfigurationService,
			platformModalFormConfigService, schedulingMainService, modelViewerModelSelectionService) {
			var service = {};

			var state = {
				infoChangedMessenger: new PlatformMessenger(),
				registeredCount: 0,
				data: {
					isReady: false,
					settings: {
						displayedTimeSpan: null,
						marginTimeSpan: null,
						windowSizeMilliseconds: null,
						relevantWindowSizeMilliseconds: null,
						onlyWithModelObjects: false
					},
					activities: {},
					currentWindowIndex: null,
					currentWindowStart: null,
					currentWindowEnd: null,
					currentTime: null,
					timeRange: null
				},
				updatesSuspended: 0,
				isTimelineLoaded: function () {
					return _.isObject(state.data.timeRange);
				},

				selectedItemId: null,
				onSelectedItemChanged: new PlatformMessenger()

			};

			function showActivityDetails(activityId) {
				schedulingMainService.loadItemById(activityId).then(function (activity) {
					var dialogConfig, formConfig;
					var activityClone = _.clone(activity);
					formConfig = schedulingMainActivityStandardConfigurationService.getStandardConfigForDetailView();
					formConfig.rows.forEach(function (row) {
						row.readonly = true;
					});
					formConfig.skipTools = true;
					dialogConfig = {
						title: $translate.instant('scheduling.main.activitydetails'),
						dataItem: activityClone,
						formConfiguration: formConfig
					};
					platformModalFormConfigService.showDialog(dialogConfig);
				});
			}

			service.showActivityDetails = showActivityDetails;

			service.setOnlyWithModelObjects = function (newValue) {
				state.data.settings.onlyWithModelObjects = newValue;

				updateData();
			};

			service.setDisplayedTimeSpan = function (timeSpan) {
				var typeSafeTimeSpan = moment.duration(timeSpan);
				state.data.settings.displayedTimeSpan = typeSafeTimeSpan;
				state.data.settings.marginTimeSpan = moment.duration(typeSafeTimeSpan.asMilliseconds() / 4);
				state.data.settings.windowSizeMilliseconds = typeSafeTimeSpan.asMilliseconds() / 2;

				updateData({
					forceRefreshWindow: true
				});
			};

			service.setDisplayedTimeSpan(moment.duration(4, 'weeks'));

			service.suspendUpdates = function () {
				state.updatesSuspended++;
			};

			service.resumeUpdates = function () {
				state.updatesSuspended--;
				if (state.updatesSuspended <= 0) {
					state.updatesSuspended = 0;
					updateData({
						forceRefreshWindow: true
					});
				}
			};

			function updateData(hints) {
				if (state.updatesSuspended > 0) {
					return;
				}

				if (state.registeredCount <= 0) {
					return;
				}
				if (!state.isTimelineLoaded()) {
					state.infoChangedMessenger.fire({
						activities: {
							isReady: false
						}
					});
					return;
				}

				var globalStartTime = state.data.timeRange.from;

				var currentTime = modelSimulationMasterService.isTimelineReady() ? modelSimulationMasterService.getCurrentTime() : state.data.timeRange.from.clone();
				state.data.currentTime = currentTime.clone();
				var newWindowIndex = Math.floor(currentTime.clone().diff(state.data.timeRange.from) / state.data.settings.windowSizeMilliseconds);
				if ((newWindowIndex !== state.data.currentWindowIndex) || (hints && hints.forceRefreshWindow)) {
					state.data.currentWindowIndex = newWindowIndex;
					state.data.currentWindowStart = globalStartTime.clone().add(moment.duration(state.data.settings.windowSizeMilliseconds * newWindowIndex)).subtract(state.data.settings.marginTimeSpan);
					state.data.currentWindowEnd = state.data.currentWindowStart.clone().add(state.data.settings.displayedTimeSpan);

					var visibleActivityIds = {};
					state.data.activities.all.forEach(function (ev) {
						if (ev.to.isAfter(state.data.currentWindowStart) && ev.from.isBefore(state.data.currentWindowEnd)) {
							if (!state.data.settings.onlyWithModelObjects || ev.IsLinkedToModel) {
								for (var current = ev; current; current = current.Parent ? state.data.activities.byId[current.Parent] : null) {
									visibleActivityIds[current.id] = true;
								}
							}
						}
					});

					state.data.activities.visible = _.filter(state.data.activities.all, function (ev) {
						return visibleActivityIds[ev.id];
					});
				}

				state.data.showActivityDetails = showActivityDetails;

				state.data.isReady = true;
				state.infoChangedMessenger.fire(state.data);
			}

			service.registerInfoChanged = function (handler) {
				state.infoChangedMessenger.register(handler);
				state.registeredCount++;
				if (state.registeredCount === 1) {
					updateData();
				} else {
					handler(state.data);
				}
			};

			service.unregisterInfoChanged = function (handler) {
				state.infoChangedMessenger.unregister(handler);
				if (state.registeredCount > 0) {
					state.registeredCount--;
				}
			};

			var colorFormatter = d3.format('06X');

			function formatColor(color) {
				return '#' + colorFormatter(color);
			}

			function retrieveData(request) {
				return $http.post(globals.webApiBaseUrl + 'scheduling/main/simgantt/activities', {
					TimelineRequest: request,
					ModelId: modelViewerModelSelectionService.getSelectedModelId()
				}).then(function (response) {
					prepareData(response.data);
				});
			}

			function resetState() {
				state.data.currentWindowIndex = null;
				state.data.currentWindowStart = null;
				state.data.currentWindowEnd = null;
				state.data.currentTime = null;
				state.data.isReady = false;
				state.data.timeRange = null;
				state.data.activities = {
					byId: {},
					all: [],
					tree: {}
				};
			}

			function prepareData(rawData) {
				resetState();

				state.data.timeRange = {
					from: moment(rawData.From),
					to: moment(rawData.To)
				};
				state.data.activities.all = _.isArray(rawData.Activities) ? _.map(rawData.Activities, function (activity) {
					var result = {
						from: moment(activity.From),
						to: moment(activity.To),
						Code: activity.Name,
						niceName: platformNiceNameService.generateNiceName(activity),
						children: [],
						id: activity.Id,
						IsLinkedToModel: activity.IsLinkedToModel,
						Parent: activity.Parent,
						ScheduleId: activity.ScheduleId
					};

					if (_.isNumber(activity.Color)) {
						result.svgColor = formatColor(activity.Color);
					}

					return result;
				}) : [];
				state.data.activities.all.forEach(function (activity) {
					if (!state.data.activities.byId[activity.id]) {
						state.data.activities.byId[activity.id] = activity;
					}
				});

				var addActivities = function (events, depth) {
					events.forEach(function (evt) {
						state.data.activities.all.push(evt);
						evt.depth = depth;
						addActivities(evt.children, depth + 1);
					});
				};

				state.data.activities.all.forEach(function (evt) {
					if (evt.Parent) {
						var parent = state.data.activities.byId[evt.Parent];
						if (parent) {
							parent.children.push(evt);
						} else {
							evt.Parent = null;
						}
					}
				});

				state.data.activities.tree = _.filter(state.data.activities.all, function (evt) {
					return !evt.Parent;
				});
				state.data.activities.all = [];
				addActivities(state.data.activities.tree, 0);

				updateData({
					forceRefreshWindow: true
				});
			}

			service.setTimelineRequest = function (request) {
				if (_.isObject(request)) {
					retrieveData(request);
				} else {
					resetState();
					updateData({
						forceRefreshWindow: true
					});
				}
			};

			service.setSelectedItemId = function (id) {
				if (state.selectedItemId !== id) {
					state.selectedItemId = id;
					state.onSelectedItemChanged.fire();
				}
			};

			service.getSelectedItemId = function () {
				return state.selectedItemId;
			};

			service.registerSelectedChanged = function (handler) {
				state.onSelectedItemChanged.register(handler);
			};

			service.unregisterSelectedChanged = function (handler) {
				state.onSelectedItemChanged.unregister(handler);
			};

			service.getSelectedItemInfo = function () {
				if (!state.selectedItemId) {
					return null;
				} else {
					return _.find(state.data.activities.all, {'id': state.selectedItemId});
				}
			};

			modelSimulationMasterService.onCurrentTimeChanged.register(updateData);

			return service;
		}]);
})();
