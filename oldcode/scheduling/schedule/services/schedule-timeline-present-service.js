/**
 * Created by leo on 26.08.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var scheduleModule = angular.module('scheduling.schedule');

	/**
	 * @ngdoc service
	 * @name schedulingScheduleTimelinePresentService
	 * @function
	 *
	 * @description
	 * schedulingScheduleTimelinePresentService is a data service for managing timelines in the project main module.
	 */
	scheduleModule.factory('schedulingScheduleTimelinePresentService', ['schedulingSchedulePresentService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (schedulingSchedulePresentService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var selectedSchedule = {};

			var schedulingScheduleTimelinePresentServiceOption = {
				module: scheduleModule,
				serviceName: 'schedulingScheduleTimelinePresentService',
				entityNameTranslationID: 'scheduling.schedule.entityTimeline',
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/schedule/timeline/', endRead: 'list' },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'TimelineDto', moduleSubModule: 'Scheduling.Schedule' })],
				presenter: { list: {} },
				entitySelection: {}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingScheduleTimelinePresentServiceOption);

			function clearList () {
				serviceContainer.data.itemList.length = 0;
			}

			function setSelectedSchedule() {
				selectedSchedule = schedulingSchedulePresentService.getSelected();

				if (selectedSchedule && selectedSchedule.Id) {
					serviceContainer.service.setFilter('mainItemID=' + selectedSchedule.Id);
					serviceContainer.service.load();
				}
				else {
					clearList();
				}
			}

			selectedSchedule = schedulingSchedulePresentService.getSelected();
			if (selectedSchedule && selectedSchedule.Id) {
				serviceContainer.service.setFilter('mainItemID=' + selectedSchedule.Id);
				serviceContainer.service.load();
			}

			schedulingSchedulePresentService.registerSelectionChanged(setSelectedSchedule);

			return serviceContainer.service;
		}
	]);
})();
