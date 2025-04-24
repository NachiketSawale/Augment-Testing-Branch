(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectAddressesLookupDataService
	 * @function
	 *
	 * @description
	 * projectAddressesLookupDataService is the data service for the projectAddresses
	 */
	var serviceName = 'projectAddressesDescLookupDataService';
	angular.module('basics.lookupdata').factory(serviceName, ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
				valMember: 'AddressFk',
				dispMember: 'AddressEntity.AddressLine',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'AddressEntity.AddressLine',
						field: 'AddressEntity.AddressLine',
						name: 'AddressLine',
						formatter: 'remark',
						width: 300,
						name$tr$: 'cloud.common.address'
					}
				]
			});
			var readData = {PKey1: null};
			var config = {
				httpRead: {route: globals.webApiBaseUrl + 'project/main/address/', endPointRead: 'lookup'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item.PKey1;
					return readData;
				}
			};
			return platformLookupDataServiceFactory.createInstance(config).service;
		}]);
})(angular);
