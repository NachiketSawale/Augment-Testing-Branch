(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsBillingSchemaByLedgerContextLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsBillingSchemaByLedgerContextLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Description',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo.Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '01831d72666d4fe1a2a860b418a05801'
			});


			var basicsBillingSchemaByLedgerContextLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/billingschema/', endPointRead: 'listall', usePostForRead: true}
			};

			var container = platformLookupDataServiceFactory.createInstance(basicsBillingSchemaByLedgerContextLookupDataServiceConfig);

			return container.service;
		}]);
})(angular);
