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

	angular.module('basics.country').factory('basicsCountrySortByDescriptionLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { SuperEntityId: -1};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCountrySortByDescriptionLookupDataService', {
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
				uuid: '0922edfc4eb04333a01a6bf20e5391ac'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/country/', endPointRead:'listsortbydescription' ,usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter() { return readData; }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
