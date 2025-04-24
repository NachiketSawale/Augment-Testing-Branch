/**
 * Created by baf on 02.09.2014.
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleValidationService
	 * @description provides validation methods for schedule instances
	 */
	angular.module('scheduling.schedule').service('schedulingScheduleRescheduleService', SchedulingScheduleRescheduleService);

	SchedulingScheduleRescheduleService.$inject = ['$http'];

	function SchedulingScheduleRescheduleService($http) {
		var projectReschedule = 1;
		var scheduleReschedule = 2;

		this.reScheduleAllProjects = function reScheduleAllProjects(prjIds) {
			return doAsyncReschedulingTask({
				Action: projectReschedule,
				IdsToHandle: prjIds
			});
		};

		this.reScheduleAllSchedules = function reScheduleAllSchedules(scheduleIds) {
			return doAsyncReschedulingTask({
				Action: scheduleReschedule,
				IdsToHandle: scheduleIds
			});
		};

		function doAsyncReschedulingTask(action) {
			return $http.post(globals.webApiBaseUrl + 'scheduling/schedule/execute', action
			).then(function (retVal) {// response not used
				return retVal;
			});

		}
	}


})(angular);
