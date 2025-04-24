/**
 * Created by baf on 15.08.2019.
 */
(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicCostGroupCatalogLookupDataService',

		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

			function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicCostGroupCatalogLookupDataService', {
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
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							width: 300,
							name$tr$: 'cloud.common.entityDescription'
						}
					],
					uuid: '2c7fcf52d1944b779a9b3d29b13a27d1'
				});

				var basicCostGroupCatalogLookupDataServiceConfig = {
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/costgroupcat/',
						endPointRead: 'licList'
					}
				};

				return platformLookupDataServiceFactory.createInstance(basicCostGroupCatalogLookupDataServiceConfig).service;
			}
		]);
})(angular);

