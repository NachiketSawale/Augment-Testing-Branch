/*
 * copied from
 * $Id: services-scheduler-status-notification-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name servicesSchedulerUIStatusNotificationService
	 * @function
	 * @requires _, $http, $interval
	 *
	 * @description Manages event handlers that get notified when the status of a job changes.
	 */
	angular.module('services.schedulerui').factory('servicesSchedulerUIStatusNotificationService', ['_', '$http', '$interval',
		function (_, $http, $interval) {
			var service = {};

			var fireFunction = function () {
				var arg = {
					jobId: this.id,
					state: this.lastState,
					isFinal: this.lastState >= 3
				};
				this.handlers.forEach(function (handler) {
					handler(arg);
				});
			};

			var state = {
				watchedJobsCount: 0,
				watchedJobs: {},
				registerHandler: function (jobId, handler) {
					var jobInfo = this.watchedJobs[jobId];
					if (!jobInfo) {
						jobInfo = {
							id: jobId,
							lastState: null,
							handlers: [],
							fireHandlers: fireFunction
						};
						this.watchedJobs[jobId] = jobInfo;
						this.watchedJobsCount++;
					}
					jobInfo.handlers.push(handler);
					if (!state.pollingPromise) {
						state.enablePolling();
					}
				},
				unregisterHandler: function (jobId, handler) {
					var jobInfo = this.watchedJobs[jobId];
					if (jobInfo) {
						var handlerIndex = jobInfo.handlers.indexOf(handler);
						if (handlerIndex >= 0) {
							jobInfo.handlers.splice(handlerIndex, 1);
							if (jobInfo.handlers.length <= 0) {
								delete this.watchedJobs[jobId];
								this.watchedJobsCount--;
							}
						}
					}
					if (state.pollingPromise) {
						state.disablePolling();
					}
				},
				pollingPromise: null,
				enablePolling: function () {
					this.pollingPromise = $interval(function () {
						$http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'services/scheduler/job/jobstates/',
							params: {
								jobIds: _.map(Object.keys(state.watchedJobs), function (key) {
									return state.watchedJobs[key].id;
								})
							}
						}).then(function (response) {
							response.data.forEach(function (jobStatus) {
								var jobInfo = state.watchedJobs[jobStatus.j];
								if (jobInfo) {
									if (jobStatus.s !== jobInfo.lastState) {
										jobInfo.lastState = jobStatus.s;
										jobInfo.fireHandlers();
										if (jobStatus.s >= 3) {
											delete state.watchedJobs[jobStatus.j];
											state.watchedJobsCount--;
											if (state.watchedJobsCount <= 0) {
												state.disablePolling();
											}
										}
									}
								}
							});
						});
					}, 15000);
				},
				disablePolling: function () {
					$interval.cancel(this.pollingPromise);
					this.pollingPromise = null;
				}
			};

			/**
			 * @ngdoc function
			 * @name callHandlerFuncForIds
			 * @function
			 * @methodOf servicesSchedulerUIStatusNotificationService
			 * @description Invokes a function once for each of a set of job IDs.
			 * @param {Array<Number> | Number} jobIds An array of job IDs, or a single job ID.
			 * @param {Function} func The function to invoke. It will be invoked as a method of `state`.
			 * @param {Function} handler The handler to pass to the function.
			 */
			function callHandlerFuncForIds(jobIds, func, handler) {
				if (angular.isArray(jobIds)) {
					jobIds.forEach(function (id) {
						func.call(state, id, handler);
					});
				} else {
					func.call(state, jobIds, handler);
				}
			}

			/**
			 * @ngdoc function
			 * @name registerHandler
			 * @function
			 * @methodOf servicesSchedulerUIStatusNotificationService
			 * @description Registers a status change notification handler for one or more jobs.
			 * @param {Array<Number> | Number} jobIds An array of job IDs, or a single job ID.
			 * @param {Function} handler The function to invoke when the status has changed.
			 */
			service.registerHandler = function (jobIds, handler) {
				callHandlerFuncForIds(jobIds, state.registerHandler, handler);
			};

			/**
			 * @ngdoc function
			 * @name unregisterHandler
			 * @function
			 * @methodOf servicesSchedulerUIStatusNotificationService
			 * @description Unregisters a handler registered with {@see registerHandler}.
			 * @param {Array<Number> | Number} jobIds An array of job IDs, or a single job ID.
			 * @param {Function} handler The function to unregister.
			 */
			service.unregisterHandler = function (jobIds, handler) {
				callHandlerFuncForIds(jobIds, state.unregisterHandler, handler);
			};

			return service;
		}]);
})();