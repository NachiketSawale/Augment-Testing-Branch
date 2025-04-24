/**
 * Created by baf on 2016/06/13.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomFixedAssetLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomFixedAssetLookupDataService is the data service for all Address Format
	 */
	angular.module('basics.lookupdata').factory('basicsCustomFixedAssetLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			let readData = { PKey1: null };
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomFixedAssetLookupDataService', {
				valMember: 'Id',
				dispMember: 'Asset',
				showIcon: true,
				columns: [
					{
						id: 'Asset',
						field: 'Asset',
						name: 'Asset',
						formatter: 'asset',
						width: 50,
						name$tr$: 'cloud.common.entityAsset'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},
				],
				uuid: '2BD6ECAA827F4DC6937036CE00F4D868'
			});


			var basicsCustomFixedAssetLookupDataServiceConfig = {

				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/equipmentfixedasset/', endPointRead: 'list', usePostForRead: true },

				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomFixedAssetLookupDataServiceConfig).service;
		}]);
})(angular);
