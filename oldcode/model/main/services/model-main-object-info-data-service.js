/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	//noinspection JSAnnotator
	/**
	 * @ngdoc service
	 * @name model.main.modelMainObjectInfoDataService
	 * @function
	 * @requires platformDataServiceFactory, modelViewerModelSelectionService,
	 *           modelViewerCompositeModelObjectSelectionService, modelViewerObjectTreeService
	 *
	 * @description Loads model object attributes.
	 */
	angular.module('model.main').service('modelMainObjectInfoDataService', ['_', 'platformDataServiceFactory',
		'modelViewerModelSelectionService', 'modelViewerCompositeModelObjectSelectionService',
		'modelViewerObjectTreeService',
		function (_, platformDataServiceFactory, modelViewerModelSelectionService,
				  modelViewerCompositeModelObjectSelectionService, modelViewerObjectTreeService) {
			var idGeneratorProcessor = {
				nextId: 1,
				processItem: function (item) {
					item.Id = this.nextId;
					this.nextId++;
				}
			};

			var serviceContainer;

			//noinspection JSAnnotator
			var modelObjectServiceOption = {
				hierarchicalLeafItem: {
					module: angular.module('model.main'),
					serviceName: 'modelMainObjectInfoDataService',
					entityNameTranslationID: 'model.main.objectInfo.entity',
					//dataProcessor: [idGeneratorProcessor],
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/objectinfo/',
						endRead: 'getattributes',
						initReadData: function (readData) {
							idGeneratorProcessor.nextId = 1;

							var modelTreeInfo = null;
							var nodeSubModelId = null;
							var node = null;

							var selObjects = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
							Object.keys(selObjects).some(function (subModelId) {
								if (selObjects[subModelId].length > 0) {
									modelTreeInfo = modelViewerObjectTreeService.getTree()[subModelId];
									nodeSubModelId = parseInt(subModelId);
									node = modelTreeInfo.byId[selObjects[subModelId][0]];
									return true;
								}
								return false;
							});

							var selModel = modelViewerModelSelectionService.getSelectedModel();
							if (modelTreeInfo && modelTreeInfo.tree) {
								readData.filter = '?parentModelId=' + selModel.info.modelId + '&modelId=' + selModel.subModelIdToGlobalModelId(modelTreeInfo.subModelId) + '&objectIds=' + (node.getAncestorIds().join(':'));
							} else {
								readData.filter = '?parentModelId=' + selModel.info.modelId + '&modelId=' + selModel.subModelIdToGlobalModelId(nodeSubModelId) + '&objectIds=' + node.id;
							}
						}
					},

					presenter: {
						tree: {
							incorporateDataRead: function (itemList, data) {
								var originalIndex = 1;
								angular.forEach(itemList, function (item) {
									item.index = originalIndex++;
								});

								itemList = _.orderBy(itemList, function (item) {
									return item.Name.toLowerCase();
								});

								var index = 1;
								var groupNames = [];
								var parentId = index;
								var treeItemList = [];
								var groupObj = [];
								var groupChildren = [];

								angular.forEach(itemList, function (item) {

									//item.LongName = item.Name;
									item.image = 'tlb-icons ico-preview-form';

									var itemParts = item.Name.split('/');
									var n = itemParts.length;
									if (n > 1) {

										// found slash
										var groupName = itemParts[0];
										if (!groupNames.includes(groupName)) {

											// new group
											groupNames.push(groupName);

											groupObj = [];
											groupObj.Id = index++;
											groupObj.Name = groupName;
											groupObj.parentId = parentId;
											treeItemList.push(groupObj);
											groupChildren = [];
										}

										item.Id = index++;
										item.parentId = groupObj.Id;
										item.Name = _.replace(item.Name, itemParts[0] + '/', '');
										groupChildren.push(item);
										groupObj.children = groupChildren;

									} else {

										// no slash
										item.Id = index++;
										item.parentId = parentId;

										// we need no root, so directly pass the children
										treeItemList.push(item);
									}

								});

								treeItemList = _.orderBy(treeItemList, 'index');

								return serviceContainer.data.handleReadSucceeded(treeItemList, data);
/*
								itemList.forEach(function (item, index) {
									item.Id = index;
								});
								return serviceContainer.data.handleReadSucceeded(itemList, data)*/
							}
						},
						modification: 'none'
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createService(modelObjectServiceOption, this);
			/**
			 * @ngdoc function
			 * @name updateData
			 * @function
			 * @methodOf modelMainObjectInfoDataService
			 * @description Updates the displayed data based upon the current model object selection.
			 */
			function updateData() {
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					if (modelViewerCompositeModelObjectSelectionService.getSelectedObjectIdCount() === 1) {
						serviceContainer.service.load();
					}
				}

				serviceContainer.service.setList([]);
			}

			modelViewerModelSelectionService.onSelectedModelChanged.register(updateData);
			modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(updateData);
			updateData();


		}]);
})(angular);
