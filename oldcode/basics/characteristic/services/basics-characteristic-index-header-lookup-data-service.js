(function (angular) {
	'use strict';
	/**
     * @ngdoc service
     * @name projectLocationMainService
     * @function
     *
     * @description
     * projectLocationMainService is the data service for all location related functionality.
     */
	angular.module('basics.characteristic').factory('basicsCharacteristicIndexHeaderLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCharacteristicIndexHeaderLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Description',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'id',
						field: 'DescriptionInfo.Description',
						name: 'Index Header',
						formatter: 'description',
						name$tr$: 'cloud.common.entityIndexHeader'
					}
				],
				uuid: '041fd19366dc4197bca4e46b0256e282'
			});
			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/characteristic/characteristic/', endPointRead: 'indexheaderlist' }
			};
			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
