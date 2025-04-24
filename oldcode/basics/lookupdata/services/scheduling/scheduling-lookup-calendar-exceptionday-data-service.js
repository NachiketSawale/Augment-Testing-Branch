/**
 * Created by welss on 26.06.2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupCalendarExceptionDayDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupCalendarExceptionDayDataService is the data service for exception day look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupCalendarExceptionDayDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupCalendarExceptionDayDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f3f58b9e9f0243fe8aeddd21adcfee83'
			});

			var schedulingCalendarWeekdayLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/calendar/exceptionday/', endPointRead: 'list' },
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(schedulingCalendarWeekdayLookupDataServiceConfig).service;
		}]);
})(angular);
