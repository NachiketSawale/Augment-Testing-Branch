/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'model.main';
	var modelMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelMainPropertyDataService
	 * @function
	 *
	 * @description
	 * modelMainPropertyDataService is the data service for properties of objects in model.
	 */
	modelMainModule.service('modelMainPropertyDataService', ModelMainPropertyDataService);
	ModelMainPropertyDataService.$inject = ['_', 'platformDataServiceFactory', 'modelMainObjectDataService',
		'platformRuntimeDataService', 'platformToolbarService', 'ServiceDataProcessDatesExtension',
		'basicsCustomizeModelValueTypeUtilityService'];

	function ModelMainPropertyDataService(_, platformDataServiceFactory, modelMainObjectDataService,
	                                      platformRuntimeDataService, platformToolbarService,
	                                      ServiceDataProcessDatesExtension,
	                                      basicsCustomizeModelValueTypeUtilityService) {
		var self = this;

		// The instance of the main service - to be filled with functionality below

		function processItem(item) {
			if (item) {
				var fields = [
					{
						field: 'PropertyKeyFk',
						readonly: item.Version > 0
					}
				];
				platformRuntimeDataService.readonly(item, fields);
			}

		}

		var serviceContainer;

		var modelObjectServiceOption = {
			flatLeafItem: {
				module: modelMainModule,
				serviceName: 'modelMainPropertyDataService',
				entityNameTranslationID: 'model.main.entityProperty',
				dataProcessor: [new ServiceDataProcessDatesExtension(['PropertyValueDate']), {processItem: processItem}],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/main/property/',
					endRead: 'listbyobject',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var obj = modelMainObjectDataService.getSelected();
						if (obj && obj.Id && obj.ModelFk) {
							readData.ModelId = obj.ModelFk;
							readData.ObjectId = obj.Id;
						} else {
							readData.ModelId = -1;
							readData.ObjectId = -1;
						}
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							for (var prop in creationData) {
								if (creationData.hasOwnProperty(prop)) {
									delete creationData[prop];
								}
							}
							var obj = modelMainObjectDataService.getSelected();
							creationData.PKey1 = obj.ModelFk;
							creationData.PKey2 = obj.Id;
						},
						incorporateDataRead: function (itemList, data) {
							angular.forEach(itemList, function (item) {
								item.idString = item.ModelFk.toString()/* + '-' + item.ObjectFk.toString()*/ + '-' + item.PropertyKeyFk.toString() + '-' + item.Id.toString();
							});
							return serviceContainer.data.handleReadSucceeded(itemList, data);
						},
						handleCreateSucceeded: function (newData) {
							newData.idString = newData.ModelFk.toString() /*+ '-' + newData.ObjectFk.toString()*/ + '-' + newData.Id.toString();
							return newData;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'Properties',
						parentService: modelMainObjectDataService
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(modelObjectServiceOption, self);
		serviceContainer.service.mergeUpdatedDataInCache = function mergeUpdatedDataInCache(updateData, data) {
			var items = data.itemList;

			var refresh = false;
			if (items && items.length) {
				var updates = updateData[data.itemName + 'ToSave'];
				_.forEach(updates, function (updated) {
					var oldItem = _.find(items, {Id: updated.Id});
					if (oldItem) {
						data.mergeItemAfterSuccessfullUpdate(oldItem, updated, true, data);
					} else {
						refresh = true;
					}
				});
			}
			if (refresh) {
				serviceContainer.service.load();
			}
		};
		//delete grid configuration button in grid container
		serviceContainer.service.toolBarHandler = function toolBarHandler(containerUUID) {
			var toolItems = _.filter(platformToolbarService.getTools(containerUUID), function (item) {
				return item && item.id !== 't111';
			});

			platformToolbarService.removeTools(containerUUID);
			return toolItems;
		};

		serviceContainer.service.getAllValueTypes = function () {
			return [1, 2, 3, 4, 5];
		};

		serviceContainer.service.valueTypeToPropName = function (vt) {
			var vtInfo = basicsCustomizeModelValueTypeUtilityService.getValueTypeInfo(vt);
			if (vtInfo) {
				return 'PropertyValue' + vtInfo.typeSuffix;
			} else {
				return null;
			}
		};
	}
})();
