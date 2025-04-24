(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name basicsCustomMDLAnnoStatusLookupDataService
     * @function
     *
     * @description
     * basicsCustomMDLAnnoStatusLookupDataService is the data service for all MDL Status look ups
     */
	angular.module('basics.lookupdata').factory('basicsCustomMDLAnnoStatusLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			const readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomMDLAnnoStatusLookupDataService', {
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
				uuid: '14dcc92d628a4ddfbc044787708ceb19'
			});
			const basicsCustomMDLAnnoStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/modelannotationstatus/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};
			return platformLookupDataServiceFactory.createInstance(basicsCustomMDLAnnoStatusLookupDataServiceConfig).service;
		}]);
})(angular);
