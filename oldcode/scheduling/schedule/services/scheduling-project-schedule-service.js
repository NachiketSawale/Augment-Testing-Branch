/*
 * $Id: scheduling-project-schedule-service.js 634057 2021-04-26 13:40:13Z welss $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling.schedule.schedulingProjectScheduleService
	 * @function
	 * @requires platformDataServiceFactory, projectMainProjectSelectionService, $http
	 *
	 * @description Loads schedules by project.
	 */
	angular.module('scheduling.schedule').service('schedulingProjectScheduleService', ['platformDataServiceFactory',
		'projectMainProjectSelectionService', '$http',
		function (platformDataServiceFactory, projectMainProjectSelectionService, $http) {
			var scheduleServiceOption = {
				flatLeafItem: {
					module: angular.module('scheduling.schedule'),
					serviceName: 'schedulingProjectScheduleService',
					entityNameTranslationID: 'scheduling.schedule.entitySchedule',
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/schedule/',
						endRead: 'list',
						initReadData: function(readData) {
							readData.filter = '?mainItemId=' + projectMainProjectSelectionService.getSelectedProjectId();
						}
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createService(scheduleServiceOption, this);

			/**
			 * @ngdoc function
			 * @name updateData
			 * @function
			 * @methodOf schedulingProjectScheduleService
			 * @description Updates the displayed data based upon the current model object selection.
			 */
			function updateData() {
				if (projectMainProjectSelectionService.getSelectedProjectId()) {
					serviceContainer.service.load();
				} else {
					serviceContainer.service.setList([]);
				}
			}

			projectMainProjectSelectionService.onSelectedProjectChanged.register(updateData);
			updateData();

			this.loadItembyId = function (scheduleId) {
				return $http.get(globals.webApiBaseUrl + 'scheduling/schedule/instance?scheduleID=' + scheduleId).then(function (response) {
					return response.data;
				});
			};
		}]);
})();
