(function () {
	'use strict';
	/* global globals */
	var moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceLookupDataService', [
		'platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsProductionPlaceLookupDataService', {
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
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f9ee33b782d240a5a6394eecc0af7838'
			});

			const requisitionLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'productionplanning/productionplace/', endPointRead: 'getlist'}
			};

			return platformLookupDataServiceFactory.createInstance(requisitionLookupDataServiceConfig).service;
		}
	]);
})();