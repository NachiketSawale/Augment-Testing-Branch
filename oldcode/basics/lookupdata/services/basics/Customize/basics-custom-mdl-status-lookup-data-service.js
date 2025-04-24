
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomMDLStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomBPDStatusLookupDataService is the data service for all BP Status look ups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomMDLStatusLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomMDLStatusLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '7436d10f58974016b2761361d35e6d40'
			});

			var basicsCustomMDLStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/modelstatus/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomMDLStatusLookupDataServiceConfig).service;
		}]);
})(angular);
