/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelSimulationTimelineLoadingService
	 * @function
	 *
	 * @description This service is responsible for triggering the loading of simulation timelines.
	 */
	angular.module('model.simulation').factory('modelSimulationTimelineLoadingService',
		modelSimulationTimelineLoadingService);

	modelSimulationTimelineLoadingService.$inject = ['_', '$q', 'PlatformMessenger',
		'modelSimulationLoadTimelineDialogService', 'modelSimulationRetrievalService', 'modelSimulationMasterService',
		'moment', 'platformModalService'];

	function modelSimulationTimelineLoadingService(_, $q, PlatformMessenger, modelSimulationLoadTimelineDialogService, modelSimulationRetrievalService,
		modelSimulationMasterService, moment, platformModalService) {

		const service = {};

		const state = {
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

					const rq = result.request;
					return modelSimulationRetrievalService.retrieveTimeline(rq).then(function (timeline) {
						if (!_.isArray(timeline) || (timeline.length > 0)) {
							const tl = modelSimulationMasterService.loadTimeline(timeline, {
								modifyStart: function (time) {
									return moment(time).clone().subtract(3, 'days');
								},
								modifyEnd: function (time) {
									return moment(time).clone().add(3, 'days');
								},
								request: rq
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

		return service;
	}
})(angular);
