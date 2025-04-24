(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomControllingUnitStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomControllingUnitStatusLookupDataService is the data service for all MDC controling unit status look ups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomTaxCodeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomTaxCodeLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				showIcon:false,
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'adf1c863ac464eee8c70fc4cb51b16d8'
			});

			var basicsCustomTaxCodeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/taxcode/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomTaxCodeLookupDataServiceConfig).service;
		}]);
})(angular);
