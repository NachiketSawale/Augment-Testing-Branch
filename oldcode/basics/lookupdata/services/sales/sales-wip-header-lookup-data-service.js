(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesWipHeaderLookupDataService
	 * @function
	 *
	 * @description
	 * salesWipHeaderLookupDataService is the data service for wip headers
	 */
	angular.module('basics.lookupdata').factory('salesWipHeaderLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesWipHeaderLookupDataService', {

				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '4ccac4f7b6ec4cd9b7f4bf6b54bcd35a'
			});

			var lookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'sales/wip/', endPointRead: 'list'},
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}]);
})(angular);
