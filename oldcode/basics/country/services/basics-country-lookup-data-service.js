/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCountryLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCountryLookupDataService is the data service providing data for Country look ups
	 */

	angular.module('basics.country').factory('basicsCountryLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCountryLookupDataService', {
				valMember: 'Id',
				dispMember: 'Iso2',
				columns: [
					{
						id: 'Iso2',
						field: 'Iso2',
						name: 'Iso2',
						formatter: 'code',
						name$tr$: 'cloud.common.entityISO2'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '0922edfc4eb04333a01a6bf20e5391ac'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/country/', endPointRead:'lookuplist' }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
