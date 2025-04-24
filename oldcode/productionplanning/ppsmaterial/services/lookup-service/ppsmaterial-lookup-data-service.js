(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('ppsmaterialLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsmaterialLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '0512f973b46f476eb6a0b49d92630424'
			});

			var serviceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/',
					endPointRead: 'lookupAll'
				}
			};

			return platformLookupDataServiceFactory.createInstance(serviceConfig).service;

		}
	]);
})();