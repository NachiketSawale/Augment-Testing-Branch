/**
 * Created by leo on 08.06.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupCalendarWeekdayDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupCalendarWeekdayDataService is the data service for wekkday look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupCalendarWeekdayDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupCalendarWeekdayDataService', {
				valMember: 'Id',
				dispMember: 'AcronymInfo.Translated',
				columns: [
					{
						id: 'Acronym',
						field: 'AcronymInfo',
						name: 'Acronym',
						formatter: 'translation',
						name$tr$: 'scheduling.calendar.entityAcronym'
					},
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
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/calendar/weekday/', endPointRead: 'list' },
				filterParam: 'mainItemId',
				prepareFilter: function prepareFilter(Id) {
					if (Id === null || Id === undefined)
					{
						Id = 0;
					}
					return '?mainItemId=' + Id;
				}
			};

			return platformLookupDataServiceFactory.createInstance(schedulingCalendarWeekdayLookupDataServiceConfig).service;
		}]);
})(angular);
