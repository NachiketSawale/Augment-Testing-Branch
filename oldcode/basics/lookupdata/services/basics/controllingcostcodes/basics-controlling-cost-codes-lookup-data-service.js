/**
 * Created by joshi on 24.06.2020.
 */
(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsControllingCostCodesLookupDataService',

		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'ServiceDataProcessArraysExtension',

			function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, ServiceDataProcessArraysExtension) {
				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsControllingCostCodesLookupDataService', {
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
					uuid: 'd0948520530848fb9a2ce52d9f43e5d2'
				});

				var basicsControllingCostCodesLookupDataServiceConfig = {
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/controllingcostcodes/',
						endPointRead: 'completetree'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['ContrCostCodeChildrens'])],
					tree: {parentProp: 'ContrCostCodeParentFk', childProp: 'ContrCostCodeChildrens'}
				};

				return platformLookupDataServiceFactory.createInstance(basicsControllingCostCodesLookupDataServiceConfig).service;
			}
		]);
})(angular);

