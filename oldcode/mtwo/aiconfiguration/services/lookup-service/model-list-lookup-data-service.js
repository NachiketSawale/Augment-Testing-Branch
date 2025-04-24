/**
 * @author: chd
 * @date: 4/8/2021 10:14 AM
 * @description:
 */
(function (angular) {
	/* global globals */
	'use strict';

	angular.module('mtwo.aiconfiguration').factory('mtwoAiModelListLookupDataService', mtwoAiModelListLookupDataService);
	mtwoAiModelListLookupDataService.$inject = ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator'];

	function mtwoAiModelListLookupDataService(platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('mtwoAiModelListLookupDataService', {
			valMember: 'Id',
			dispMember: 'Code',
			columns: [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					width: 100,
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					width: 150,
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			uuid: '29171cfd14d440f684661e7dea1de204'
		});

		let modelListLookupDataServiceConfig = {
			httpRead: {
				route: globals.webApiBaseUrl + 'mtwo/aiconfiguration/model/',
				endPointRead: 'all'
			}
		};

		let serviceContainer = platformLookupDataServiceFactory.createInstance(modelListLookupDataServiceConfig);

		serviceContainer.service.getItemByKey = function getItemByKey(id) {
			return serviceContainer.service.getItemById(id, serviceContainer.options);
		};

		return serviceContainer.service;

	}
})(angular);
