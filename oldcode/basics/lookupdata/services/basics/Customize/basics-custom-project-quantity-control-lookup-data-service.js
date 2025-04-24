/**
 * Created by Frank and Benjamin on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomProjectQuantityControlLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomProjectQuantityControlLookupDataService is the data service for all contract status
	 */
	angular.module('basics.lookupdata').factory('basicsCustomProjectQuantityControlLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomProjectQuantityControlLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				showIcon:true,
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						formatterOptions: {
							imageSelector: 'platformStatusIconService'
						},
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 250,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '6d532eff2a7843dcbc10d454c004b378'
			});

			var basicsCustomProjectQuantityControlLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/projectquantitycontrol/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomProjectQuantityControlLookupDataServiceConfig).service;
		}]);
})(angular);
