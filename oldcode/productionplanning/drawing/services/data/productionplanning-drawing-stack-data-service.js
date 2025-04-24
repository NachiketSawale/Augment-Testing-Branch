(function (angular) {
	/* global _,globals */
	'use strict';
	var moduleName = 'productionplanning.drawing';
	var module = angular.module(moduleName);

	module.factory('productionplanningDrawingStackDataService', StackDataService);

	StackDataService.$inject = ['$injector', '$http', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function StackDataService($injector, $http, platformDataServiceFactory, basicsCommonMandatoryProcessor) {

		var serviceCache = {};

		function createNewComplete(serviceOptions) {
			var parentService = getService1(serviceOptions.parentService) || getService1('productionplanningDrawingMainService');
			var serviceInfo = {
				flatNodeItem: {
					module: module,
					serviceName: parentService.getServiceName() + 'DrawingStackDataService',
					entityNameTranslationID: 'productionplanning.drawing.entityStack',
					entityRole: {
						node: {
							itemName: 'Stacks',
							parentService: parentService,
							parentFilter: 'drawingFk'
						}
					},
					presenter: {
						list: {
							initCreationData: function (creationData) {
								creationData.Id = parentService.getSelected().Id;
							}
						}
					}
				}
			};

			if(serviceOptions.useLocalResource){
				serviceInfo.flatNodeItem.httpRead = {
					useLocalResource: true,
					resourceFunction: function () {
						return parentService.getSelected().PersistObject.EngStacks;
					}
				};
			}else {
				serviceInfo.flatNodeItem.httpCRUD = {route: globals.webApiBaseUrl + 'productionplanning/drawing/stack/'};
			}

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'EngStackDto',
				moduleSubModule: 'ProductionPlanning.Drawing',
				validationService: $injector.get('productionplanningDrawingStackValidationService').getService(container.service)
			});

			var oldStoreCacheForFun = container.data.storeCacheFor;

			//override to support idProperty
			container.data.storeCacheFor = function storeCacheFor(item, data) {
				if (data.idProperty) {
					var itemCache = data.cache[item.Id];

					if (!itemCache) {
						itemCache = {
							loadedItems: [],
							selectedItems: [],
							modifiedItems: [],
							deletedItems: []
						};
					}

					data.cache[item.Id] = itemCache;

					if (data.itemTree) {
						angular.forEach(data.itemTree, function (item) {
							if (!_.find(itemCache.loadedItems, function (loadedItem) {
								return loadedItem[data.idProperty] === item[data.idProperty];
							})) {
								itemCache.loadedItems.push(item);
							}
						});
					} else {
						angular.forEach(data.itemList, function (item) {
							if (!_.find(itemCache.loadedItems, function (loadedItem) {
								return loadedItem[data.idProperty] === item[data.idProperty];
							})) {
								itemCache.loadedItems.push(item);
							}
						});
					}

					if (data.selectedItems) {
						angular.forEach(data.selectedItems, function (item) {
							if (!_.find(itemCache.selectedItems, function (loadedItem) {
								return loadedItem[data.idProperty] === item[data.idProperty];
							})) {
								itemCache.selectedItems.push(item);
							}
						});
						data.selectedItems.length = 0;
					}

					angular.forEach(data.modifiedItems, function (item) {
						if (!_.find(itemCache.modifiedItems, function (loadedItem) {
							return loadedItem[data.idProperty] === item[data.idProperty];
						})) {
							itemCache.modifiedItems.push(item);
						}
					});
					data.isChanged = false;

					angular.forEach(data.deletedItems, function (item) {
						if (!_.find(itemCache.deletedItems, function (loadedItem) {
							return loadedItem[data.idProperty] === item[data.idProperty];
						})) {
							itemCache.deletedItems.push(item);
						}
					});
				} else {
					oldStoreCacheForFun(item, data);
				}
			};
			container.service.createItemSimple = function (creationOptions, customCreationData, onCreateSucceeded) {
				var data = container.data;
				var creationData = _.merge(creationOptions, customCreationData);
				return data.doCallHTTPCreate(creationData, data, onCreateSucceeded);
			};

			container.service.updateSimple = function (updateData) {
				return $http.post(globals.webApiBaseUrl + 'productionplanning/drawing/stack/save', updateData);
			};

			return container.service;
		}

		function getService(serviceOptions) {
			serviceOptions = serviceOptions || {};
			var serviceKey = serviceOptions.parentService ? getService1(serviceOptions.parentService).getServiceName() : null || 'productionplanningDrawingStackDataService';
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(serviceOptions);
			}
			return serviceCache[serviceKey];
		}

		function getService1(service) {
			return  !service || _.isObject(service) ? service : $injector.get(service);
		}

		return {
			getService: getService
		};
	}
})(angular);