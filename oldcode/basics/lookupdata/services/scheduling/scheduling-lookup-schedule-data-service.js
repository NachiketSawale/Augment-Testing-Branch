/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupScheduleDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupScheduleDataService is the data service for calendar look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupScheduleDataService', ['platformLookupDataServiceFactory', 'schedulingLookupScheduleDataProcessor',

		function (platformLookupDataServiceFactory, scheduleStyleProcessor) {

			var schedulingCalendarLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/schedule/', endPointRead: 'list' },
				filterParam: 'mainItemID',
				dataProcessor: [scheduleStyleProcessor]
			};

			return platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig).service;
		}]);
})(angular);
