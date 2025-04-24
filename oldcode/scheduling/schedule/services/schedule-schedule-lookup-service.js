/**
 * Created by leo on 22.10.2014.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleLookupService
	 * @function
	 *
	 * @description
	 * schedulingScheduleLookupService is the data service for all lookup related functionality.
	 */
	angular.module('scheduling.schedule').factory('schedulingScheduleLookupService', ['$q', '$http', 'basicsLookupdataLookupDescriptorService',

		function ($q, $http, basicsLookupdataLookupDescriptorService) {
			var service = {};
			var calendarList = [];
			var projectList = [];
			var scheduleList = [];
			var projectId = -1;

			service.getCalendarList = function getCalendarList() {
				var deferred = $q.defer();
				if (calendarList.length > 0) {
					deferred.resolve(calendarList);
				} else {
					$http.get(globals.webApiBaseUrl + 'scheduling/calendar/list'
					).then(function (response) {
						calendarList = response.data;
						basicsLookupdataLookupDescriptorService.updateData('calendar', calendarList);
						deferred.resolve(calendarList);
					}
					);
				}
				return deferred.promise;
			};

			service.getProjectList = function getProjectList() {
				var deferred = $q.defer();
				if (projectList.length > 0) {
					deferred.resolve(projectList);
				} else {
					$http.get(globals.webApiBaseUrl + 'project/main/list'
					).then(function (response) {
						projectList = response.data;
						basicsLookupdataLookupDescriptorService.updateData('project', projectList);
						deferred.resolve(projectList);
					}
					);
				}
				return deferred.promise;
			};

			service.getScheduleList = function getScheduleList() {
				var deferred = $q.defer();

				$http.get(globals.webApiBaseUrl + 'scheduling/schedule/list?mainItemID=' + projectId
				).then(function (response) {
					scheduleList = response.data;
					basicsLookupdataLookupDescriptorService.updateData('schedule', scheduleList);
					deferred.resolve(scheduleList);
				}
				);
				return deferred.promise;
			};

			service.setProjectId = function setProjectId(prjId) {
				projectId = prjId;
			};

			return service;
		}
	]);
})();
