(function () {
	'use strict';
	/*global _, angular, globals*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsMountingModelSimulationTimelineLoadingService', ['$q', 'PlatformMessenger',
		'ppsMountingModelSimulationLoadTimelineDialogService', 'modelSimulationMasterService',
		'moment', 'platformModalService', '$injector', '$http',
		function ($q, PlatformMessenger,
					 modelSimulationLoadTimelineDialogService, modelSimulationMasterService,
					 moment, platformModalService, $injector, $http) {
			var service = {};

			var state = {
				onStartLoad: new PlatformMessenger(),
				onEndLoad: new PlatformMessenger()
			};

			service.registerStartLoad = function (handler) {
				state.onStartLoad.register(handler);
			};

			service.unregisterStartLoad = function (handler) {
				state.onStartLoad.unregister(handler);
			};

			service.registerEndLoad = function (handler) {
				state.onEndLoad.register(handler);
			};

			service.unregisterEndLoad = function (handler) {
				state.onEndLoad.unregister(handler);
			};

			service.loadTimeline = function () {
				return modelSimulationLoadTimelineDialogService.showDialog().then(function (result) {
					if (result.success) {
						state.onStartLoad.fire();

						var rq = result.request;
						rq.DateKind = 'p'; // Planned
						return retrieveTimeline(rq).then(function (timelineResult) {
							var timeline = timelineResult.Timeline;
							if (!_.isArray(timeline) || (timeline.length > 0)) {
								var tl = modelSimulationMasterService.loadTimeline(timeline, {
									modifyStart: function (time) {
										return moment(time).clone().subtract(1, 'hours');
									},
									modifyEnd: function (time) {
										return moment(time).clone().add(1, 'hours');
									},
									request: _.merge(rq, {
										Schedules: timelineResult.ScheduleIds.map(function (scId) { return {ScheduleId: scId}; })
									})
								});

								return $q.when(tl);
							} else {
								return platformModalService.showMsgBox('model.simulation.noEvents', 'model.simulation.noEventsTitle', 'info').then(function () {
									return null;
								});
							}
						}).then(function (result) {
							state.onEndLoad.fire();
							return result;
						});
					} else {
						return $q.resolve(null);
					}
				});
			};

			var retrieveTimeline = function retrieveTimeline(request) {
				var modelSimulationMasterService = $injector.get('modelSimulationMasterService');
				request.Options = modelSimulationMasterService.getContextOptions();

				return $http.post(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/modelsimulation/retrieve', request).then(function (response) {
					if (response.status === 200) {
						return response.data || [];
					} else {
						return $q.reject(response.status);
					}
				});
			};

			service.retrieveTimeline = retrieveTimeline;

			return service;
		}]);
})();
