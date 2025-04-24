/**
 * Created by leo on 16.09.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var calendarModule = angular.module('scheduling.calendar');

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWorkHourService
	 * @function
	 *
	 * @description
	 * schedulingCalendarWorkHourService is the data service for all WorkHour related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	calendarModule.factory('schedulingCalendarWorkHourService', ['schedulingCalendarMainService', 'platformDataServiceFactory',
		'SchedulingDataProcessTimesExtension',

		function (schedulingCalendarMainService, platformDataServiceFactory, SchedulingDataProcessTimesExtension) {

			var exceptServiceOption = { flatLeafItem: {
				module: calendarModule,
				serviceName: 'schedulingCalendarWorkHourService',
				entityNameTranslationID: 'scheduling.calendar.workhourListHeader',
				httpCreate: { route: globals.webApiBaseUrl + 'scheduling/calendar/workhour/', endCreate: 'create' },
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/calendar/workhour/', endRead: 'list'},
				dataProcessor: [new SchedulingDataProcessTimesExtension(['WorkStart', 'WorkEnd'])],
				presenter: { list: {
					initCreationData: function initCreationData(creationData) {
						// creationData.mainItemId = creationData.parentId;
						creationData.PKey1 = schedulingCalendarMainService.getSelected().Id;
					}}},
				entityRole: { leaf: { itemName: 'Workhours', moduleName: 'Calendar', parentService: schedulingCalendarMainService } }
			} };

			var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

			return serviceContainer.service;
		}
	]);
})();
