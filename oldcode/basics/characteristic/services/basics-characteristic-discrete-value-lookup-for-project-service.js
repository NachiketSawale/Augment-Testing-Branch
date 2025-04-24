(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	angular.module(moduleName).factory('basicsCharacteristicDiscreteValueLookupForProjectService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCharacteristicDiscreteValueLookupForProjectService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				desMember: 'DescriptionInfo.Translated',
				lookupType: 'CharacteristicValue',
				moduleQualifier: 'basicsCharacteristicDiscreteValueLookupForProjectService',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'c6a4302c887f405681255fd7ff4c527a'
			});


			var config = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/characteristic/discretevalue/',
					endPointRead: 'list'
				},
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(config).service;
		}]);
})(angular);
