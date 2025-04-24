/**
 * Created by leo on 18.09.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var calendarModule = angular.module('scheduling.calendar');

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWorkdayService
	 * @function
	 *
	 * @description
	 * schedulingCalendarWorkdayService is the data service for all Workday related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	calendarModule.factory('schedulingCalendarWorkdayService', ['$translate', 'schedulingCalendarMainService', 'platformDataServiceFactory',
		'ServiceDataProcessDatesExtension', 'SchedulingDataProcessTimesExtension',

		function ($translate, schedulingCalendarMainService, platformDataServiceFactory, ServiceDataProcessDatesExtension, SchedulingDataProcessTimesExtension) {

			var exceptServiceOption = { flatLeafItem: {
				module: calendarModule,
				serviceName: 'schedulingCalendarWorkdayService',
				entityNameTranslationID: 'scheduling.calendar.translationDescWorkday',
				httpCreate: { route: globals.webApiBaseUrl + 'scheduling/calendar/workday/', endCreate: 'create' },
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/calendar/workday/', endRead: 'list'},
				dataProcessor: [new ServiceDataProcessDatesExtension(['ExceptDate']),
					new SchedulingDataProcessTimesExtension(['WorkStart', 'WorkEnd'])],
				presenter: { list: {
					initCreationData: function initCreationData(creationData) {
						creationData.PKey1 = schedulingCalendarMainService.getSelected().Id;
						// creationData.mainItemId = creationData.parentId;
					}}},
				translation: { uid: 'schedulingCalendarWorkdayService',
					title: 'scheduling.calendar.translationDescWorkday',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: {
						typeName: 'WorkdayDto',
						moduleSubModule: 'Scheduling.Calendar'
					}
				},
				entityRole: { leaf: { itemName: 'Workdays', moduleName: 'Calendar', parentService: schedulingCalendarMainService } }
			} };

			var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

			return serviceContainer.service;
		}
	]);
})();
