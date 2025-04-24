(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';
	/* global _,globals */
	/**
	 * @ngdoc service
	 * @name constructionSystemMainContainerService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *
	 */
	angular.module(moduleName).factory('constructionSystemMainContainerService', [
		'platformDataServiceFactory', 'constructionSystemMainContainerFilterService',
		'$injector','constructionSystemMainObjectService',
		function (platformDataServiceFactory, constructionSystemMainContainerFilterService,
			$injector,constructionSystemMainObjectService) {
			var currentModelId;
			var serviceOption = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainContainerService',
					entityNameTranslationID: 'model.main.entityContainer',
					httpCreate: {route: globals.webApiBaseUrl + 'model/main/container/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/container/',
						endRead: 'tree',
						usePostForRead: false,
						initReadData: function initReadData(readData) {
							if(currentModelId) {
								readData.filter = '?mainItemID=' + currentModelId;
							}
						}
					},
					entitySelection: {},
					entityRole: {
						root: {
							itemName: 'ModelContainer',
							lastObjectModuleName: moduleName,
							rootForModule: moduleName
						}
					},
					presenter: {
						tree: {parentProp: 'ContainerFk', childProp: 'Containers'}
					},
					actions: {delete: false, create: false}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service=serviceContainer.service;

			// disable display information of the selected root item to the header bar.
			service.setShowHeaderAfterSelectionChanged(null);

			service=constructionSystemMainContainerFilterService.addMarkersChanged(service,
				{parentProp: 'ContainerFk', childProp: 'Containers'},
				{id: 'filterContainer', iconClass: 'tlb-icons ico-filter-container'});

			service.reLoadObjectsDataByContainersFilter= function reLoadObjectsDataByContainersFilter(){
				var itemName = 'Container';
				var filters=constructionSystemMainContainerFilterService.getFilters()[itemName];
				if(_.isArray(filters) && _.size(filters) > 0) {
					constructionSystemMainObjectService.loadDataByContainerFilter(filters);
				}
			};

			service.loadData=function loadData(modelId){
				if(currentModelId!==modelId) {
					if(!_.isNull(currentModelId) && !_.isUndefined()) {
						service.load();
					} else {
						serviceContainer.data.clearContent(serviceContainer.data);
					}
				}
			};

			return service;
		}
	]);
})(angular);
