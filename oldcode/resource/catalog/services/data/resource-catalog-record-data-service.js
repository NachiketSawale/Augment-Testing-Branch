/**
 * Created by baf on 02.11.2017
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.catalog');

	/**
	 * @ngdoc service
	 * @name resourceCatalogRecordDataService
	 * @description pprovides methods to access, create and update resource catalog record entities
	 */
	myModule.service('resourceCatalogRecordDataService', ResourceCatalogRecordDataService);

	ResourceCatalogRecordDataService.$inject = ['platformDataServiceFactory', 'resourceCatalogDataService'];

	function ResourceCatalogRecordDataService(platformDataServiceFactory, resourceCatalogDataService) {
		var self = this;
		var resourceCatalogRecordServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceCatalogRecordDataService',
				entityNameTranslationID: 'resource.catalog.entityResourceRecord',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/catalog/record/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceCatalogDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceCatalogDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Records', parentService: resourceCatalogDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceCatalogRecordServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
