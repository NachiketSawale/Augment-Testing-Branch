/**
 * Created by baf on 2017/08/29
 */
(function () {
	'use strict';
	var resourceTypeModule = angular.module('resource.type');

	/**
	 * @ngdoc service
	 * @name resourceTypeDataService
	 * @function
	 *
	 * @description
	 * resourceTypeDataService is a data service for managing stocks of a project.
	 */
	resourceTypeModule.factory('resourceTypeDataService', ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'ServiceDataProcessArraysExtension', 'resourceTypeProcessorService',

		function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, ServiceDataProcessArraysExtension, resourceTypeProcessorService) {

			var resourceTypeDataServiceOption = {
				hierarchicalRootItem: {
					module: resourceTypeModule,
					serviceName: 'resourceTypeDataService',
					entityNameTranslationID: 'resource.type.entityResourceType',
					httpCRUD: {route: globals.webApiBaseUrl + 'resource/type/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete'},
					dataProcessor: [new ServiceDataProcessArraysExtension(['SubResources']), platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ResourceTypeDto',
						moduleSubModule: 'Resource.Type'
					}),resourceTypeProcessorService],
					entityRole: {root: {itemName: 'ResourceTypes', moduleName: 'cloud.desktop.moduleDisplayNameResourceTypes'}},
					presenter: {
						tree: {
							parentProp: 'ResourceTypeFk',
							childProp: 'SubResources',
							initCreationData: function initCreationData(creationData) {
								var parentId = creationData.parentId;
								delete creationData.parentId;
								if(!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
									creationData.PKey1 = parentId;
								}
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'resource.type',
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: null,
							showOptions: false,
							showProjectContext: false,
							withExecutionHints: true
						}
					},
					translation: {
						uid: 'resourceTypeDataService',
						title: 'resource.type.entityResourceType',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: {
							typeName: 'ResourceTypeDto',
							moduleSubModule: 'Resource.Type'
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(resourceTypeDataServiceOption);
			var service = serviceContainer.service;

			service.deleteItem = function deleteItem(entity){
				var items = [entity];
				return serviceContainer.data.deleteEntities(items, serviceContainer.data);
			};

			return service;
		}
	]);
})();
