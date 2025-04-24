/**
 * Created by aljami on 27.10.2020.
 */

(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = new angular.module(moduleName);

	configModule.factory('basicsConfigDashboardLookupDataService', basicsConfigDashboardLookupDataService);

	basicsConfigDashboardLookupDataService.$inject = ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

	function basicsConfigDashboardLookupDataService(platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigDashboardLookupDataService', {
			valMember: 'Id',
			dispMember: 'ExternalName',
			columns: [
				{
					id: 'ExternalName',
					field: 'ExternalName',
					name: 'ExternalName',
					formatter: 'description',
					name$tr$: 'basics.config.entityName'
				}
			],
			uuid: '2ec68681903544bfbe5f159382a61d70'
		});

		var dashboardLookupDataServiceConfig = {
			httpRead: { route: globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard/', endPointRead:'lookup', usePostForRead:false}
		};

		return platformLookupDataServiceFactory.createInstance(dashboardLookupDataServiceConfig).service;
	}

})(angular);