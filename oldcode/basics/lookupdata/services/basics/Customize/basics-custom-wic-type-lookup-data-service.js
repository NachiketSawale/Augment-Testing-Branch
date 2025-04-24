(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsCustomWicTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomWicTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon:false,
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
				uuid: 'dc06a1a4dd7647a39fb7ade89d7e95b3'
			});

			var basicsCustomLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/wictype/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomLookupDataServiceConfig).service;
		}]);
})(angular);
