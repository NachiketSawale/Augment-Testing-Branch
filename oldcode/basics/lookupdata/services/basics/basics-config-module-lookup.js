(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsConfigModuleLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigModuleLookupService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				uuid: '35aa68cebcb1482db81b27629454b7a9'
			});

			var config = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/',
					endPointRead: 'listAll'
				},
				usePostForRead: false
			};

			return platformLookupDataServiceFactory.createInstance(config).service;

		}]);

})(angular);


