(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	angular.module(moduleName).factory('basicsCharacteristicDiscreteValueLookupForEstimateService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCharacteristicDiscreteValueLookupForEstimateService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				desMember: 'DescriptionInfo.Translated',
				lookupType: 'CharacteristicValue',
				moduleQualifier: 'basicsCharacteristicDiscreteValueLookupForEstimateService',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f04a132f74f249e4bc6b6a3295778902'
			});


			var config = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/characteristic/discretevalue/',
					endPointRead: 'listbysorting'
				},
				filterParam: 'mainItemId'
			};



			return platformLookupDataServiceFactory.createInstance(config).service;
		}]);
})(angular);
