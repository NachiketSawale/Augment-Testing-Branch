/**
 * Created by zov on 27/06/2019.
 */
(function () {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('ppsEngineeringTaskLookupDataService', ppsEngineeringTaskLookupDataService);
	ppsEngineeringTaskLookupDataService.$inject = ['basicsLookupdataConfigGenerator',
		'platformLookupDataServiceFactory'];
	function ppsEngineeringTaskLookupDataService(basicsLookupdataConfigGenerator,
												 platformLookupDataServiceFactory) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsEngineeringTaskLookupDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			uuid: '9f87f7d952044062bf1cfc24b48862b8',
			columns: [
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				}
			]
		});

		var lookupDataServiceConfig = {
			httpRead: {
				route: globals.webApiBaseUrl + 'productionplanning/engineering/task/',
				endPointRead: 'getByDrawing'
			},
			filterParam: true
		};

		return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
	}
})();