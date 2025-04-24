(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsCustomSalesTaxGroupLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomSalesTaxGroupLookupDataService', {
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

			var basicsCustomLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/salestaxgroup/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomLookupDataServiceConfig).service;
		}]);
})(angular);
