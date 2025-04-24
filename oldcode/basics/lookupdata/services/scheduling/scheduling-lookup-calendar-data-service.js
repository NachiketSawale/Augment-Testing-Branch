/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupCalendarDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupCalendarDataService is the data service for calendar look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupCalendarDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupCalendarDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f7d706d43d2b48c8b0a295695da52850'
			});

			var schedulingCalendarLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/calendar/', endPointRead: 'list' },
				navigator: { moduleName: 'scheduling.calendar'}
			};

			return platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig).service;
		}]);
})(angular);
