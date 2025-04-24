/**
 * Created by baf on 02.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var scheduleModule = angular.module('scheduling.schedule');

	/**
	 * @ngdoc service
	 * @name schedulingSchedulePresentService
	 * @function
	 *
	 * @description
	 * schedulingSchedulePresentService is a data service for presentation of schedules.
	 */
	scheduleModule.factory('schedulingSchedulePresentService', ['$q', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function ($q, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			// The instance of the main service - to be filled with functionality below

			var schedulingSchedulePresentServiceOption = {
				module: scheduleModule,
				serviceName: 'schedulingSchedulePresentService',
				entityNameTranslationID: 'scheduling.schedule.entitySchedule',
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/schedule/', endRead: 'instance'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ScheduleDto',
					moduleSubModule: 'Scheduling.Schedule'
				})],
				presenter: {list: {}},
				entitySelection: {}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingSchedulePresentServiceOption);

			serviceContainer.service.setFilter('scheduleID=');
			serviceContainer.data.isLoading = false;
			serviceContainer.data.isForPinning = false;
			serviceContainer.data.pinnedSchedule = null;

			function doLoadSchedule(service, data, id, isForPinning) {
				service.setFilter('scheduleID=' + id);
				serviceContainer.data.isForPinning = isForPinning;
				data.isLoading = true;
				return service.load().then(function () {
					data.isLoading = false;
					if (isForPinning) {
						data.pinnedSchedule = data.itemList[0];
					}
				});
			}

			serviceContainer.service.isLoadingForPininng = function isLoadingForPininng() {
				return serviceContainer.data.isLoading && serviceContainer.data.isForPinning;
			};

			serviceContainer.service.loadSchedule = function loadSchedule(id, isForPinning) {
				if (!serviceContainer.data.isLoading && !serviceContainer.service.getItemById(id)) {
					return doLoadSchedule(serviceContainer.service, serviceContainer.data, id, isForPinning);
				} else {
					return $q.when(true);
				}
			};

			serviceContainer.service.getItemById = function getScheduleById(Id) {
				var data = serviceContainer.data;

				if (data.pinnedSchedule !== null && data.pinnedSchedule.Id === Id) {
					return data.pinnedSchedule;
				}

				return data.getItemById(Id, data);
			};

			serviceContainer.service.asPinnedSchedule = function asPinnedSchedule(schedule) {
				var data = serviceContainer.data;

				if (data.pinnedSchedule === null || data.pinnedSchedule.Id === schedule.Id) {
					data.pinnedSchedule = schedule;
				}
			};

			serviceContainer.service.useSchedule = function getScheduleById(schedule) {
				serviceContainer.data.pinnedSchedule = schedule;
			};

			return serviceContainer.service;
		}]);
})(angular);
