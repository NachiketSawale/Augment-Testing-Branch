
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name basicsCustomMDLObjectsetStatusLookupDataService
     * @function
     *
     * @description
     * basicsCustomBPDStatusLookupDataService is the data service for all BP Status look ups
     */
	angular.module('basics.lookupdata').factory('basicsCustomMDLObjectsetStatusLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomMDLObjectsetStatusLookupDataService', {
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
				uuid: '14a212b473044683aa59d83cc03b19cd'
			});

			var basicsCustomMDLObjectsetStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/modelobjectsetstatus/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomMDLObjectsetStatusLookupDataServiceConfig).service;
		}]);
})(angular);
