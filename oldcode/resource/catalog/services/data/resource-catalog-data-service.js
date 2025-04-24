/**
 * Created by baf on 27.10.2017
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.catalog');

	/**
	 * @ngdoc service
	 * @name resourceCatalogValidationService
	 * @description provides validation methods for information request entities
	 */
	myModule.service('resourceCatalogDataService', ResourceCatalogDataService);

	ResourceCatalogDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension' , 'resourceCatalogValidationProcessor'];

	function ResourceCatalogDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, resourceCatalogValidationProcessor) {
		var self = this;
		var resourceCatalogServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceCatalogDataService',
				entityNameTranslationID: 'resource.catalog.entityResourceCatalog',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/catalog/catalog/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'CatalogDto',
					moduleSubModule: 'Resource.Catalog'
				})],
				translation: {
					uid: 'resourceCatalogDataService',
					title: 'resource.catalog.entityResourceCatalog',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: {
						typeName: 'CatalogDto',
						moduleSubModule: 'Resource.Catalog'
					}
				},
				entityRole: {root: {itemName: 'Catalogs', moduleName: 'cloud.desktop.moduleDisplayNameEquipmentCatalogs'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: { list: {
					initCreationData: function initCreationData(creationData) {
						creationData.PKey1 = null;
					}
				}},
				sidebarSearch: {
					options: {
						moduleName: 'resource.catalog',
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
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceCatalogServiceOption, self);
		serviceContainer.data.newEntityValidator = resourceCatalogValidationProcessor;
		serviceContainer.data.Initialised = true;

		serviceContainer.service.loadCatalog = function loadCatalog() {
			if(serviceContainer.data.itemList.length === 0) {
				serviceContainer.data.doReadData(serviceContainer.data);
			}
		};


	}

})(angular);
