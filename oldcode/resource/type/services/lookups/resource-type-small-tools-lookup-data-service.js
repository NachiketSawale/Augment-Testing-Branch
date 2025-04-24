/**
 * Created by baf 2025/03/03
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceTypeSmallToolsLookupDataService
	 * @function
	 *
	 * @description
	 * resourceTypeSmallToolsLookupDataService is the data service for small tool resource types
	 */
	angular.module('resource.type').factory('resourceTypeSmallToolsLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceTypeSmallToolsLookupDataService', {
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
					},
					{
						id: 'CommentText',
						field: 'CommentText',
						name: 'CommentText',
						formatter: 'comment',
						width: 300,
						name$tr$: 'cloud.common.entityComment'
					},
					{
						id: 'Specification',
						field: 'Specification',
						name: 'Specification',
						formatter: 'remark',
						width: 300,
						name$tr$: 'cloud.common.EntitySpec'
					}


				],
				uuid: '86ea703db2e3446da6093a4729f588c4'
			});

			const resourceTypeSmallToolsLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/type/',
					endPointRead: 'smalltools'
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubResources'])],
				tree: {
					parentProp: 'ResourceTypeFk',
					childProp: 'SubResources'
				}
			};

			const serviceContainer = platformLookupDataServiceFactory.createInstance(resourceTypeSmallToolsLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);