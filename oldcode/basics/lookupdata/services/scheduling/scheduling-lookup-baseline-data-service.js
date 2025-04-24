/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupBaselineDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupBaselineDataService is the data service for schedule baseline look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupBaselineDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectLookupGroupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'fb2d7ea8c3c641889d5083ed68864b2c'
			});

			var schedulingCalendarLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/main/baseline/', endPointRead: 'list' }
			};

			return platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig).service;
		}]);
})(angular);
