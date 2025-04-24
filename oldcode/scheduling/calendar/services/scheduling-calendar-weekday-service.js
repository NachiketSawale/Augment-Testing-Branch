/**
 * Created by leo on 16.09.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var calendarModule = angular.module('scheduling.calendar');

	/**
	 * @ngdoc service
	 * @name schedulingCalendarWeekdayService
	 * @function
	 *
	 * @description
	 *  is the data service for all weekday related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	calendarModule.factory('schedulingCalendarWeekdayService', ['$translate', 'schedulingCalendarMainService', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',

		function ($translate, schedulingCalendarMainService, platformDataServiceFactory, basicsLookupdataLookupDescriptorService) {

			var exceptServiceOption = { flatLeafItem: {
				module: calendarModule,
				serviceName: 'schedulingCalendarWeekdayService',
				entityNameTranslationID: 'scheduling.calendar.translationDescWeekday',
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/calendar/weekday/', endRead: 'list' },
				presenter: { list: {
					initCreationData: function initCreationData(creationData) {
						// creationData.mainItemId = creationData.parentId;
						creationData.PKey1 = schedulingCalendarMainService.getSelected().Id;
					}}},
				translation: { uid: 'schedulingCalendarWeekdayService',
					title: 'scheduling.calendar.translationDescWeekday',
					columns: [
						{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' },
						{ header: 'cloud.common.entityAcronym', field: 'AcronymInfo' }],
					dtoScheme: {
						typeName: 'WeekdayDto',
						moduleSubModule: 'Scheduling.Calendar'
					}
				},
				actions: {},
				entityRole: { leaf: { itemName: 'Weekdays', moduleName: 'Calendar', parentService: schedulingCalendarMainService } }
			} };

			var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

			function setLookupDescriptor(){
				basicsLookupdataLookupDescriptorService.updateData('weekday', serviceContainer.service.getList());
			}
			serviceContainer.service.registerListLoaded(setLookupDescriptor);

			return serviceContainer.service;
		}
	]);
})();
