(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	/**
     * @ngdoc service
     * @name transportplanningPackagePrj2AddressLookupDataService
     * @function
     *
     * @description
     * transportplanningPackagePrj2AddressLookupDataService is the data service for getting project2address data.
     */
	angular.module(moduleName).factory('transportplanningPackagePrj2AddressLookupDataService', lookupDataService);
	lookupDataService.$inject = ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'globals'];

	function lookupDataService($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, globals) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('transportplanningPackagePrj2AddressLookupDataService', {
			valMember: 'Id',
			dispMember: 'Description',
			uuid: 'd5cf4ca990224c67b8f83ab21526c54c',
			columns: [
				{
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					width: 100
				},
				{
					id: 'address',
					field: 'AddressEntity.Address',
					name: 'Address',
					name$tr$: 'basics.common.entityAddress',
					width: 100
				},
				{
					id: 'addressType',
					field: 'AddressTypeFk',
					name: 'Address Type',
					name$tr$: 'project.main.AddressTypeFk',
					width: 80,
					formatter: 'lookup',
					formatterOptions: {'lookupType': 'AddressType', 'displayMember': 'Description'}
				}
			]

		});

		var readData =  { PKey1: -1 };
		var lookupDataServiceConfig = {
			httpRead: {
				route: globals.webApiBaseUrl + 'project/main/address/',
				endPointRead: 'listbyparent',
			},
			filterParam: readData,
			prepareFilter:function (item) {
				if(item){
					readData.PKey1 = item;
				}
				return readData;
			}
		};

		return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
	}
})(angular);
