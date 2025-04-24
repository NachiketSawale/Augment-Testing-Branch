(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'constructionsystem.main';
	var modelMainModule = angular.module(moduleName);

	modelMainModule.service('constructionsystemMainObjectHierarchicalDataService',
		['platformDataServiceFactory', 'constructionSystemMainObjectHierarchicalFilterService',
			function (platformDataServiceFactory, constructionSystemMainObjectHierarchicalFilterService) {

				var currentModelId;
				var serviceOption = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionsystemMainObjectHierarchicalDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'model/main/object/',
							endRead: 'objectstructure',
							usePostForRead: false,
							initReadData: function initReadData(readData) {
								// fix defect #107517
								// model could be empty in construction system instance
								readData.filter = '?modelId=' + (currentModelId || 0);
							}
						},
						entitySelection: {},
						entityRole: {
							root: {
								itemName: 'ObjectHierarchical',
								lastObjectModuleName: moduleName,
								rootForModule: moduleName
							}
						},
						presenter: {
							tree: {parentProp: 'ObjectFk', childProp: 'Children'}
						},
						actions:{}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				serviceContainer.data.doUpdate = null;

				service.setShowHeaderAfterSelectionChanged(null);

				service = constructionSystemMainObjectHierarchicalFilterService.addMarkersChanged(service,
					{parentProp: 'ObjectFk', childProp: 'Children'},
					{id: 'filterObject', iconClass: 'tlb-icons ico-filter-off'});

				service.setCurrentModelId = function(modelId){
					currentModelId = modelId;
				};

				service.loadData = function loadData(modelId) {
					if (angular.isUndefined(modelId)) {
						if (angular.isDefined(currentModelId)) {
							service.load();
						}
					} else {
						if (currentModelId !== modelId) {
							currentModelId = modelId;
							if (currentModelId) {
								service.load();
							} else {
								serviceContainer.data.clearContent(serviceContainer.data);
							}
						}
					}
				};

				function collectItems(item, childProp, resultArr) {
					resultArr = resultArr || [];
					resultArr.push(item);
					_.each(item[childProp], function (item) {
						collectItems(item, childProp, resultArr);
					});
					return resultArr;
				}

				service.getSelectedWithChild = function () {
					var itemsWithChild = [];
					var selectedItems = service.getSelectedEntities();
					angular.forEach(selectedItems, function (item) {
						var items = collectItems(item, 'Children');
						itemsWithChild = itemsWithChild.concat(items);
					});
					return itemsWithChild;
				};

				return service;


			}]);
})(angular);
