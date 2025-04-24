(function () {
	'use strict';
	/*global globals, angular*/

	var moduleName = 'productionplanning.cadimportconfig';
	angular.module(moduleName).factory('ppsCadimportconfigLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsCadimportconfigLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				uuid: '4a671bc8d3f74cfbb0f1105b8d1e6508'
			});
			return platformLookupDataServiceFactory.createInstance({
				httpRead: { route: globals.webApiBaseUrl + 'productionplanning/engineering/cadimportconf/', endPointRead: 'list', usePostForRead: false },
			}).service;
		}
	]);
})();