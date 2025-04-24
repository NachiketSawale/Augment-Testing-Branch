/**
 * Created by Simon on 15.03.2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupSubScheduleDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupSubScheduleDataService is the data service for calendar look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupSubScheduleDataService', ['platformLookupDataServiceFactory', 'schedulingLookupScheduleDataProcessor',

		function (platformLookupDataServiceFactory, scheduleStyleProcessor) {

			var schedulingCalendarLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/schedule/', endPointRead: 'listsubscheduleswhichcontainsactivities' },
				filterParam: 'scheduleId',
				dataProcessor: [scheduleStyleProcessor]
			};

			return platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig).service;
		}]);
})(angular);
