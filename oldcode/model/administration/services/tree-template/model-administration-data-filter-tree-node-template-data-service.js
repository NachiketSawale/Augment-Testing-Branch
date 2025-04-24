
/*
 * $Id: model-main-object-IFCTree-data-service.js 334 2021-05-21 10:07:38Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.administration';
	const modelFilterTreeNodeTemplateModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelAdministrationDataFilterTreeNodeTemplateDataService
	 * @function
	 *
	 * @description
	 * modelAdministrationDataFilterTreeNodeTemplateDataService is the data service for node template tree.
	 */
	modelFilterTreeNodeTemplateModule.service('modelAdministrationDataFilterTreeNodeTemplateDataService', modelAdministrationDataFilterTreeNodeTemplateDataService);
	modelAdministrationDataFilterTreeNodeTemplateDataService.$inject = ['platformDataServiceFactory', 'modelAdministrationDataService', 'modelAdministrationDataFilterTreeTemplateDataService', '_', 'modelAdministrationDataFilterTreeNodeTemplateActionProcessor', 'ServiceDataProcessArraysExtension','modelAdministrationDataFilterTreeNodeTemplateImageProcessor'];

	function modelAdministrationDataFilterTreeNodeTemplateDataService(platformDataServiceFactory, modelAdministrationDataService, modelAdministrationDataFilterTreeTemplateDataService, _, modelAdministrationDataFilterTreeNodeTemplateActionProcessor, ServiceDataProcessArraysExtension, modelAdministrationDataFilterTreeNodeTemplateImageProcessor) {
		let serviceContainer;
		const self = this;
		const modelObjectServiceOption = {
			hierarchicalLeafItem: {
				module: moduleName,
				serviceName: 'modelAdministrationDataFilterTreeNodeTemplateDataService',
				entityNameTranslationID: 'model.administration.ModelFilterTreeNodeTemplates',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/treenodetemplate/',
					endRead: 'list',
					initReadData: function (readData) {
						var selected = modelAdministrationDataFilterTreeTemplateDataService.getSelected();
						readData.filter = '?treeTemplateId=' + (selected.Id ?? 0)
					}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['children']), modelAdministrationDataFilterTreeNodeTemplateImageProcessor],
				actions: {
					delete: true,
					create: 'hierarchical',
					canCreateChildCallBackFunc: function (selectedItem) {
						if (_.isNil(selectedItem)) {
							return false;
						}
						if (!selectedItem.IsAutoIntegration) {
							return true;
						}
					}
				},
				entitySelection: {},
				presenter: {
					tree: {
						parentProp: 'ModelFiltertreenodetemplateParentFk',
						childProp: 'children',
						initCreationData: function initCreationData(creationData) {
							let selected = self.getSelected();
							if (selected) {
								let parentId = creationData.parentId;
								delete creationData.parentId;
								if (!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
									creationData.PKey1 = parentId;
								}
							}
						},
						handleCreateSucceeded: function (newCreatedItem) {
							newCreatedItem.Action = generateAction(newCreatedItem);
							return newCreatedItem;
						},
						incorporateDataRead: function (result, data) {
							// Create a map of node ID to node object
							const nodeMap = {};

							// Keep track of processed node IDs
							const processedNodeIds = {};
							result.forEach(function (item) {
								nodeMap[item.Id] = item;
							});

							// Assign children to their respective parent nodes
							result.forEach(function (item) {
								// Add the Action column with the settings action icon by processing the item
								item.Action = { Action: 'Settings', actionList: [] };
								modelAdministrationDataFilterTreeNodeTemplateActionProcessor.processItem(item);
								if (item.ModelFiltertreenodetemplateParentFk !== null && nodeMap[item.ModelFiltertreenodetemplateParentFk]) {
									const parentNode = nodeMap[item.ModelFiltertreenodetemplateParentFk];
									if (!parentNode.children) {
										parentNode.children = [];
									}
									// Check if this node's children have already been processed
									if (!processedNodeIds[item.Id]) {
										parentNode.children.push(item);
										processedNodeIds[item.Id] = true;
									}


								}
							});

							// Convert nodeMap to an array of top-level nodes
							//const treeResult = Object.keys(nodeMap).map(function (key) {
							//	return nodeMap[key];
							//});
							// Filter out nodes with parents to get only top-level nodes
							const topLevelNodes = result.filter(function (item) {
								return item.ModelFiltertreenodetemplateParentFk === null;
							});

							// Return the result
							return serviceContainer.data.handleReadSucceeded(topLevelNodes, data);
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ModelFilterTreeNodeTemplates',
						parentService: modelAdministrationDataFilterTreeTemplateDataService
					}
				}
			}
		};
		serviceContainer = platformDataServiceFactory.createService(modelObjectServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.CreateAutoIntegrated = false;
		serviceContainer.service.createAutoIntegratedRoot = function createAutoIntegratedRoot() {
			serviceContainer.data.CreateAutoIntegrated = true;
			serviceContainer.service.createItem();
		};
		serviceContainer.service.registerSelectionChanged(function () {
			modelAdministrationDataService.update();
			serviceContainer.data.listLoaded.fire();
			//service.onUpdated.fire();
		});
		// Function to refresh the grid
		serviceContainer.service.reloadGrid = function () {
			serviceContainer.service.load(); // Load or refresh data
		};

		serviceContainer.service.registerSelectionChanged(onSelectionChanged);

		function onSelectionChanged(e, entity) {
			if (!entity) {
				return;
			}
			//	serviceContainer.service.load();
			serviceContainer.data.listLoaded.fire();
		}
		function generateAction(item) {
			if (!item) {
				return '';
			}
			item.Action = { Action: 'Settings', actionList: [] };
			modelAdministrationDataFilterTreeNodeTemplateActionProcessor.processItem(item);
			return item.Action;
		}
		return serviceContainer.service;

	}
})(angular);


