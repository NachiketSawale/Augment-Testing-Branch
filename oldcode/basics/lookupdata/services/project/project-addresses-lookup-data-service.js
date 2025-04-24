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
	var serviceName = 'projectAddressesLookupDataService';
	angular.module('basics.lookupdata').factory(serviceName, ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
				valMember: 'Id',
				dispMember: 'AddressLine',
				columns: [
					{
						id: 'AddressLine',
						field: 'AddressLine',
						name: 'AddressLine',
						formatter: 'remark',
						width: 300,
						name$tr$: 'cloud.common.address'
					}
				]
			});
			var config = {
				httpRead: {route: globals.webApiBaseUrl + 'project/main/address/', endPointRead: 'getProjectAddresses'},
				filterParam: 'projectId'
			};
			return platformLookupDataServiceFactory.createInstance(config).service;
		}]);
})(angular);
