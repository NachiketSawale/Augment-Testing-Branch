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
	angular.module('basics.lookupdata').factory('resourceTypeLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				idProperty: 'Id',
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
				uuid: '28a933b4413a402a98ecc5137d9f980c'
			});

			var resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/type/',
					endPointRead: 'tree'
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['SubResources'])],
				tree: {
					parentProp: 'ResourceTypeFk',
					childProp: 'SubResources'
				}
			};

			var serviceContainer = platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);