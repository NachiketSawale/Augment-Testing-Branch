(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomAccountLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomAccountLookupDataService is the data service for all account look ups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomAccountLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomAccountLookupDataService', {
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
				uuid: '0807b482c3e211e9aa8c2a2ae2dbcce4'
			});

			var basicsCustomAccountLookupDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/accounting/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomAccountLookupDataServiceConf).service;
		}]);
})(angular);
