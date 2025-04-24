/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'model.main';
	var modelMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelMainObjectHierarchicalDataService
	 * @function
	 *
	 * @description
	 * modelMainObjectDataService is the data service for object in model. Objects are the main entity
	 */
	modelMainModule.service('modelMainObjectHierarchicalDataService', ModelMainObjectDataService);
	ModelMainObjectDataService.$inject = ['_', 'modelMainObjectDataService', 'platformDataServiceFactory', 'modelMainFilterService', 'modelMainFilterCommon', 'cloudDesktopPinningContextService'];

	function ModelMainObjectDataService(_, modelMainObjectDataService, platformDataServiceFactory, modelMainFilterService, modelMainFilterCommon, cloudDesktopPinningContextService) {

		var self = this;
		var selectedModel = null;
		// The instance of the main service - to be filled with functionality below
		var modelObjectServiceOption = {
			module: moduleName,
			serviceName: 'modelMainObjectHierarchicalDataService',
			entityNameTranslationID: 'model.main.entityObject',
			httpRead: {
				route: globals.webApiBaseUrl + 'model/main/object/', endRead: 'objectstructure',
				initReadData: function (readData) {
					readData.filter = '?modelId=' + selectedModel.Id;
				}
			},
			entitySelection: {},
			presenter: {
				tree: {
					parentProp: 'ObjectFk', childProp: 'Children'
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(modelObjectServiceOption, self);
		serviceContainer.service.setSelectedModel = function setSelectedModel(item) {

			if (item && item.Id && selectedModel && selectedModel.Id !== item.Id || !selectedModel && item && item.Id) {
				selectedModel = item;
				var found = _.find(serviceContainer.data.itemList, {ModelFk: item.Id});
				if (_.isNil(found) && item.Id) {
					serviceContainer.service.load();
				}
			} else if (!item) {
				selectedModel = null;
				serviceContainer.data.itemTree.length = 0;
				serviceContainer.data.itemList.length = 0;
				serviceContainer.data.listLoaded.fire();
			}
		};

		function getPinningContext(pinnedContext) {
			if (pinnedContext) {
				var found = _.find(pinnedContext, {token: 'model.main'});
				if (found && selectedModel && selectedModel.Id !== found.id || !selectedModel && found) {
					var exist = _.find(serviceContainer.data.itemList, {ModelFk: found.id});
					selectedModel = {Id: found.id};
					if (_.isNil(exist)) {
						serviceContainer.service.load();
					}
				} else if (_.isNil(found)) {
					if (selectedModel && selectedModel.Id) {
						serviceContainer.service.load();
					} else {
						selectedModel = null;
						serviceContainer.data.itemTree.length = 0;
						serviceContainer.data.itemList.length = 0;
						serviceContainer.data.listLoaded.fire();
					}
				}
			}
		}

		cloudDesktopPinningContextService.onSetPinningContext.register(getPinningContext);
		cloudDesktopPinningContextService.onClearPinningContext.register(getPinningContext);
		modelMainObjectDataService.onModelContextUpdated.register(function () {
			serviceContainer.service.setSelectedModel(modelMainObjectDataService.getSelectedModel());
		});

		serviceContainer.service.markersChanged = function markersChanged(itemList) {
			if (_.isArray(itemList) && _.size(itemList) > 0) {
				modelMainFilterService.addFilter('modelMainObjectHierarchicalListController', serviceContainer.service, function (objectItem) {
					var allItems = [];
					// get all child locations (for each item)
					_.each(itemList, function (item) {
						var items = _.map(modelMainFilterCommon.collectItems(item, 'Children'), function (item) {
							return {'Id': item.Id, 'ModelFk': item.ModelFk};
						});
						allItems = allItems.concat(items);
					});
					var filter = _.filter(allItems, {'Id': objectItem.ObjectFk, 'ModelFk': objectItem.ModelFk});
					return filter.length > 0;
				}, {id: 'filterObject', iconClass: 'tlb-icons ico-filter-container'});
			} else {
				modelMainFilterService.removeFilter('modelMainObjectHierarchicalListController');
			}
		};

		serviceContainer.service.setSelectedModel(modelMainObjectDataService.getSelectedModel());
	}
})(angular);
