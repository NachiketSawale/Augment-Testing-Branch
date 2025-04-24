/**
 * Created by leo on 26.08.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var scheduleModule = angular.module('scheduling.schedule');

	/**
	 * @ngdoc service
	 * @name schedulingScheduleEditService
	 * @function
	 *
	 * @description
	 * schedulingScheduleTimelineEditService is a data service for managing timelines in the project main module.
	 */
	scheduleModule.factory('schedulingScheduleTimelineEditService', ['schedulingScheduleEditService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (schedulingScheduleEditService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var schedulingScheduleTimelineEditServiceOption = {
				flatLeafItem: {
					module: scheduleModule,
					serviceName: 'schedulingScheduleTimelineEditService',
					entityNameTranslationID: 'scheduling.schedule.entityTimeline',
					httpCreate: {route: globals.webApiBaseUrl + 'scheduling/schedule/timeline/'},
					httpRead: {route: globals.webApiBaseUrl + 'scheduling/schedule/timeline/'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TimelineDto',
						moduleSubModule: 'Scheduling.Schedule'
					})],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var schedule = schedulingScheduleEditService.getSelected();
								if (schedule) {
									creationData.PKey1 = schedule.Id;
								}
							}
						}
					},
					entityRole: {leaf: {itemName: 'Timelines', parentService: schedulingScheduleEditService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingScheduleTimelineEditServiceOption);

			return serviceContainer.service;
		}
	]);
})();
