(function () {
	'use strict';
	/* global globals */

	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceChildrenLookupDataService', [
		'platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsProductionPlaceChildrenLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
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
				uuid: '06afd4091dbd4911887189028da82018'
			});

			const requisitionLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'productionplanning/productionplace/', endPointRead: 'mobilelist'}
			};

			return platformLookupDataServiceFactory.createInstance(requisitionLookupDataServiceConfig).service;
		}
	]);
})();