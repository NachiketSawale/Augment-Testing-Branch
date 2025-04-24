/**
 * Created by baf on 2017/08/28.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectStockLocationLookupDataService
	 * @function
	 *
	 * @description
	 * projectLocationLookupDataService is the data service for all location look ups
	 */
	angular.module('basics.lookupdata').factory('projectStockLocationLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension,basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectStockLocationLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
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
				uuid:'b7872df0cbb5464f990237bc32685e5c'
			});
			var readData = {PKey1: null, PKey2: null};
			var stockLocationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/stock/location/', endPointRead: 'instances' },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					if (item !== undefined) {
						if (item.PKey1 !== undefined || item.PKey2 !== undefined) {
							readData.PKey1 = item.PKey1;
							readData.PKey2 = item.PKey2;
						} else {
							readData.PKey1 = item;
							readData.PKey2 = null;
						}
					}
					return readData;
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubLocations'])],
				tree: { parentProp: 'StockLocationFk', childProp: 'SubLocations' }
			};

			return platformLookupDataServiceFactory.createInstance(stockLocationLookupDataServiceConfig).service;
		}]);
})(angular);
