(function (angular) {
	'use strict';

	/* global _,globals */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionSystem main object list/detail controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainObjectService', [
		'$q', 'platformDataServiceFactory', '$http', 'PlatformMessenger', 'constructionSystemMainModelFilterService', '$injector',
		function ($q, platformDataServiceFactory, $http, PlatformMessenger, constructionSystemMainModelFilterService, $injector) {
			var currentModelId;
			var containerIds = [], objectIds = [], objectFks = [];
			var filterId = 'disabled';
			var allObjects = [];
			var serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainObjectService',
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/object/',
						endRead: 'containerfilter',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							if (currentModelId) {
								readData.ModelId = currentModelId;
								readData.ContainerIds = containerIds;
								readData.ObjectIds = objectIds;
								readData.ObjectFks = objectFks;
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'ModelObject',
							rootForModule: moduleName,
							lastObjectModuleName: moduleName
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								var dtos = readData.dtos;
								_.each(dtos, function (item) {
									item.IsChecked = false;
								});
								service.OnLoad.fire();
								if (allObjects.length <= dtos.length) {// cache all objects for main clipboard
									allObjects = dtos;
								}

								$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
									basicsCostGroupAssignmentService.process(readData, service, {
										mainDataName: 'dtos',
										attachDataName: 'ModelObject2CostGroups',
										dataLookupType: 'ModelObject2CostGroups',
										identityGetter: function identityGetter(entity){
											return {
												ModelFk: entity.RootItemId,
												Id: entity.MainItemId
											};
										}
									});

								}]);

								return data.handleReadSucceeded(dtos, data);
							}
						}
					},
					actions: {delete: false, create: false}
				}
			};

			var hasLoaded = false;

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			serviceContainer.data.doUpdate = function () {
				return $q.when();
			};

			var service = serviceContainer.service;

			// disable display information of the selected root item to the header bar.
			service.setShowHeaderAfterSelectionChanged(null);

			service.checkAllItems = function checkAllItems(checked) {
				angular.forEach(service.getList(), function (item) {
					item.IsChecked = checked;
				});
				service.gridRefresh();
			};


			service.OnLoad = new PlatformMessenger();
			// add the onCostGroupCatalogsLoaded messenger
			service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			service.loadDataByContainerFilter = function loadDataByContainerFilter(filters) {
				containerIds = filters;
				loadObjectsByFilter();
			};

			service.loadData = function loadData(modelId) {
				currentModelId = modelId;
				loadObjectsByFilter();
			};

			service.markAsHasntLoaded = function markAsHasntLoaded(){
				hasLoaded = false;
			};

			service.loadDataOnlyOnce = function loadDataOnlyOnce(modelId){
				if(!hasLoaded){
					currentModelId = modelId;
					loadObjectsByFilter();
				}
			};

			// use for clipboard
			service.getAllsFromCache = function () {
				return allObjects;
			};

			// var lastModelObjectInfo = null;

			function loadObjectsByFilter() {
				// eslint-disable-next-line no-unused-vars
				var filteredModelObjectIds = null;
				if (filterId === 'disabled') {// default load all
					// eslint-disable-next-line no-unused-vars
					filteredModelObjectIds = null;
				} else if (filterId === 'moduleContext') {
					objectIds = constructionSystemMainModelFilterService.getObjectIdsBy3DViewerFilterId('moduleContext');
				} else if (filterId === 'objectSearchSidebar') {
					objectIds = constructionSystemMainModelFilterService.getObjectIdsBy3DViewerFilterId('objectSearchSidebar');
				}

				objectFks = constructionSystemMainModelFilterService.getSelectedObjectIds();

				if (!_.isNull(currentModelId) && !_.isUndefined(currentModelId)) {
					service.load();
					hasLoaded = true;
				} else {
					serviceContainer.data.clearContent(serviceContainer.data);
				}
				// }
			}

			// Object filter
			service.setFilterId = function (newFilterId) {
				if (filterId !== newFilterId) {
					filterId = newFilterId;
					loadObjectsByFilter();
				}
			};

			service.registerObjectsFilter = function () {
				// register to load data when 3D viewer change
				constructionSystemMainModelFilterService.registerFilteredObjectsChanged(loadObjectsByFilter);
			};

			service.unregisterObjectsFilter = function () {
				constructionSystemMainModelFilterService.unregisterFilteredObjectsChanged(loadObjectsByFilter);
			};


			constructionSystemMainModelFilterService.onSelectedObjectIdsChanged.register(loadObjectsByFilter);

			service.objectSelectList = new PlatformMessenger();
			service.propertyReload = new PlatformMessenger();

			return service;
		}
	]);
})(angular);
