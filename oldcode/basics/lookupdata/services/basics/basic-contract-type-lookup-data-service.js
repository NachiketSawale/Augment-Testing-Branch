/**
 * Created by hzh on 2017/05/24.
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicContractTypeLookupDataService', ['$http','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function($http,platformLookupDataServiceFactory,basicsLookupdataConfigGenerator){
	        var readData =  { PKey1: null };
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicContractTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.descriptionInfo'
					}
				],
				uuid: 'f55f3a17c8bf4bed9402c50af9255d74'
			});

			var basicContractTypeLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/customize/projectcontracttype/', endPointRead: 'list', usePostForRead: true },
	          filterParam: readData,
	          prepareFilter: function prepareFilter(item) {
		          readData.PKey1 = item;
		          return readData;
	          }
			};

			return platformLookupDataServiceFactory.createInstance(basicContractTypeLookupDataServiceConfig).service;
		}
	]);
})(angular);