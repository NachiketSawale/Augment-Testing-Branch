/**
 * Created by baf on 16.11.2017
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.componenttype';
	var myModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name resourceComponentTypeDataService
	 * @description provides methods to access, create and update resource componenttype  entities
	 */
	myModule.service('resourceComponentTypeDataService', ResourceComponentTypeDataService);

	ResourceComponentTypeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension'];

	function ResourceComponentTypeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {
		var self = this;
		var resourceComponentTypeServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceComponentTypeDataService',
				entityNameTranslationID: 'resource.componenttype.entityComponentType',
				httpCRUD: {route: globals.webApiBaseUrl + 'resource/componenttype/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PlantComponentTypeDto',
					moduleSubModule: 'Resource.ComponentType'
				})],
				entityRole: {
					root: {
						itemName: 'ComponentTypes',
						moduleName: 'cloud.desktop.moduleDisplayNamePlantComponentType'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: { list: {} },

				translation: {
					uid: 'resourceComponentTypeDataService',
					title: 'resource.componenttype.entityComponentType',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: {
						typeName: 'PlantComponentTypeDto',
						moduleSubModule: 'Resource.ComponentType'
					}
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceComponentTypeServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.service.loadComponentTypes = function loadComponentTypes() {
			if(serviceContainer.data.itemList.length === 0) {
				serviceContainer.data.doReadData(serviceContainer.data);
			}
		};
	}

})(angular);
