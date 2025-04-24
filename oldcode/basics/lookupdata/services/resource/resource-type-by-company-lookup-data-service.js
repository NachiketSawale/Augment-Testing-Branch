/**
 * Created by baf 2017/08/30
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceTypeLookupDataService
	 * @function
	 *
	 * @description
	 * resourceTypeLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceTypeByCompanyLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceTypeByCompanyLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '96d7aeea32784fbabe2a1c68d9669df9'
			});

			var resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/type/',
					endPointRead: 'treebycompany'
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubResources'])],
				tree: {
					parentProp: 'ResourceTypeFk',
					childProp: 'SubResources'
				},
				filterParam: 'companyId'
			};

			var serviceContainer = platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
