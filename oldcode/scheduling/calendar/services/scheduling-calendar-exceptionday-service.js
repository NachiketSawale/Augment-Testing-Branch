/**
 * Created by leo on 18.09.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var calendarModule = angular.module('scheduling.calendar');

	/**
	 * @ngdoc service
	 * @name schedulingCalendarExceptionDayService
	 * @function
	 *
	 * @description
	 * schedulingCalendar is the data service for all exception day related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	calendarModule.factory('schedulingCalendarExceptionDayService', ['$translate', 'schedulingCalendarMainService', 'platformDataServiceFactory',
		'ServiceDataProcessDatesExtension', 'SchedulingDataProcessTimesExtension','schedulingCalendarExceptiondayProcessor',

		function ($translate, schedulingCalendarMainService, platformDataServiceFactory, ServiceDataProcessDatesExtension, SchedulingDataProcessTimesExtension, schedulingCalendarExceptiondayProcessor) {

			function getExceptionDayDataProcessors() {
				return [new ServiceDataProcessDatesExtension(['ExceptDate']),
					new SchedulingDataProcessTimesExtension(['WorkStart', 'WorkEnd']),
					schedulingCalendarExceptiondayProcessor];
			}

			var exceptServiceOption = {
				flatLeafItem: {
					module: calendarModule,
					serviceName: 'schedulingCalendarExceptionDayService',
					entityNameTranslationID: 'scheduling.calendar.translationDescExcept',
					httpCreate: { route: globals.webApiBaseUrl + 'scheduling/calendar/exceptionday/', endCreate: 'create' },
					httpRead: { route: globals.webApiBaseUrl + 'scheduling/calendar/exceptionday/', endRead: 'list' },
					dataProcessor: getExceptionDayDataProcessors(),
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								// creationData.mainItemId = creationData.parentId;
								creationData.PKey1 = schedulingCalendarMainService.getSelected().Id;
							}}
					},
					translation: {
						uid: 'schedulingCalendarExceptionDayService',
						title: 'scheduling.calendar.translationDescExcept',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: {
							typeName: 'ExceptionDayDto',
							moduleSubModule: 'Scheduling.Calendar'
						}
					},
					entityRole: { leaf: { itemName: 'ExceptionDays', moduleName: 'Calendar', parentService: schedulingCalendarMainService } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);
			var service = serviceContainer.service;

			serviceContainer.service.addItems = function addItems(items){
				var list = serviceContainer.service.getList();
				var selectedId = schedulingCalendarMainService.getSelected().Id;
				angular.forEach(items, function (item) {
					if(item.CalendarFk === selectedId) {
						list.push(item);
					}
					service.markItemAsModified(item);
				});

				serviceContainer.data.listLoaded.fire();
			};

			service.getUsedExceptionDayDataProcessors = function getUsedExceptionDayDataProcessors() {
				return getExceptionDayDataProcessors();
			};

			return service;
		}
	]);
})
();
