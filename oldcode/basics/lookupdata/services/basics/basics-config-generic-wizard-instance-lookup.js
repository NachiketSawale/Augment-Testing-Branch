(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsConfigGenericWizardInstanceLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigGenericWizardInstanceLookupService', {
				valMember: 'Id',
				dispMember: 'Comment',
				columns: [
					{
						id: 'Description',
						field: 'Comment',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '5d065c0bb6d24d178ff589babcec577a'
			});

			var basicsMasterDataRubricCategoryLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/genwizard/instance/',
					endPointRead: 'getUseCaseWizards'
				},
			};

			return platformLookupDataServiceFactory.createInstance(basicsMasterDataRubricCategoryLookupDataServiceConfig).service;

		}]);

	angular.module(moduleName).factory('basicsConfigGenericWizardUseCaseLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigGenericWizardUseCaseLookupService', {
				valMember: 'WizardConfiGuuid',
				dispMember: 'Comment',
				uuid: 'cae447605baf4292bae2d1a26a5c5933'
			});

			var basicsMasterDataRubricCategoryLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/genwizard/instance/',
					endPointRead: 'getUseCaseUuidList'
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsMasterDataRubricCategoryLookupDataServiceConfig).service;

		}]);

})(angular);


