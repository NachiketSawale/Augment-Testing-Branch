/*
 * $Id: model-main-object-IFCTree-data-service.js 334 2021-05-21 10:07:38Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.filtertrees';
	const modelFilterTreeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name modelFiltertreesIFCTreeDataService
	 * @function
	 *
	 * @description
	 * modelFiltertreesDataService is the data service for object in model. Objects are the main entity
	 */
	modelFilterTreeModule.service('modelFiltertreesIFCTreeDataService', modelFiltertreesDataService);
	modelFiltertreesDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'modelViewerModelSelectionService', 'modelMainFilterService', 'cloudDesktopPinningContextService', 'basicsWorkflowSidebarRegisterService', '$injector', 'platformSidebarWizardCommonTasksService', 'modelViewerModelIdSetService', 'modelMainFilterCommon', 'mainViewService'];

	function modelFiltertreesDataService(_, $http, platformDataServiceFactory, modelViewerModelSelectionService, modelMainFilterService, cloudDesktopPinningContextService, basicsWorkflowSidebarRegisterService, $injector, platformSidebarWizardCommonTasksService, modelViewerModelIdSetService, modelMainFilterCommon, mainViewService) {


		const self = this;
		let containerId = '722a80284d6843a19d4ec83f5183cbaa';
		function getStorageKey() {
			return 'active-tree-template-id';
		}

		function getPreviouslySelectedTemplateId() {
			const key = getStorageKey();
			return mainViewService.customData(containerId, key);  // Retrieving previously selected templateId
		}

		function saveSelectedTemplateId() {
			const key = getStorageKey();
			mainViewService.customData(containerId, key, self.activeTemplateId);  // Saving activeTemplateId
		}

		function setSelectedTemplateIdAtStart() {
			const previouslySelectedTemplateId = getPreviouslySelectedTemplateId();
			if (previouslySelectedTemplateId !== undefined) {
				self.activeTemplateId = previouslySelectedTemplateId;  // Set the active template ID
			}
		}

		// Initialize the template ID at the start
		setSelectedTemplateIdAtStart();

		const modelObjectServiceOption = {
			hierarchicalRootItem: {
				module: moduleName,
				serviceName: 'modelFiltertreesIFCTreeDataService',
				entityNameTranslationID: 'model.filtertrees.entityObject',
				httpRead: {
					route: globals.webApiBaseUrl + 'model/FilterTrees/',
					endRead: 'trees',
					initReadData: function (readData) {
						const selectedModelId = modelViewerModelSelectionService.getSelectedModelId();
						// Validation: If no model is selected
						if (!selectedModelId) {
							return;
						}
						readData.filter = '?modelId=' + (selectedModelId ?? 0);
						if (self.activeTemplateId != null) {
							readData.filter += '&templateId=' + (self.activeTemplateId);
						}

					}
				},
				actions: {
					create: false,
					delete: false
				},
				entitySelection: {},
				presenter: {
					tree: {
						incorporateDataRead: function (result, data) {
							// Create a map of node ID to node object
							const nodeMap = {};
							// Check if the result is empty
							if (result.RootNodes.length != 0) {
								self.activeTemplateId = result.ModelFilterTreeTemplateFk;
								saveSelectedTemplateId();
							}
							// Keep track of processed node IDs
							const processedNodeIds = {};

							result.RootNodes.forEach(function (item) {
								nodeMap[item.Id] = item;
							});

							// Assign children to their respective parent nodes
							result.RootNodes.forEach(function (item) {
								if (item.ModelFiltertreeNodeParentFk !== null && nodeMap[item.ModelFiltertreeNodeParentFk]) {
									const parentNode = nodeMap[item.ModelFiltertreeNodeParentFk];
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
							const topLevelNodes = result.RootNodes.filter(function (item) {
								return item.ModelFiltertreeNodeParentFk === null;
							});

							// Return the result
							return serviceContainer.data.handleReadSucceeded(topLevelNodes, data);
						}


					}
				},

				entityRole: {
					root: {
						codeField: null,
						descField: 'DescriptionInfo.Description',
						itemName: 'ModelFilterTree',
						moduleName: 'ModelFilterTree',
						mainItemName: 'ModelFilterTree',
						handleUpdateDone: function (updateData, response) {

						}
					}
				},
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(modelObjectServiceOption, self);
		self.switchTreeTemplate = function (templateId) {
			self.activeTemplateId = templateId;
			saveSelectedTemplateId();  // Save the selected template ID to storage
			serviceContainer.service.load();  // Load the data based on the selected template
		};



		modelViewerModelSelectionService.onSelectedModelChanged.register(function () {
			const selectedModelId = modelViewerModelSelectionService.getSelectedModelId();
			// Validation: If no model is selected
			if (!selectedModelId) {
				return;
			}
			serviceContainer.service.load()
		});
		serviceContainer.service.markersChanged = function markersChanged(itemList) {
			if (_.isArray(itemList) && _.size(itemList) > 0) {
				modelMainFilterService.addFilter('modelFiltertreesIFCTreeListController', serviceContainer.service, function (objectItem) {
					let allItems = [];
					_.each(itemList, function (item) {
						const allObjectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(item.ObjectIds);
						Object.keys(allObjectIds).forEach(modelId => {
							modelId = parseInt(modelId);
							allObjectIds[modelId].forEach(id => {
								allItems.push({ 'Id': id, 'ModelFk': modelId });
							});
						});
					});
					const filter = _.filter(allItems, { 'Id': objectItem.Id, 'ModelFk': objectItem.ModelFk });
					return filter.length > 0;
				}, { id: 'filterObject', iconClass: 'tlb-icons ico-filter-container' });
			} else {
				modelMainFilterService.removeFilter('modelFiltertreesIFCTreeListController');
			}
		};
		serviceContainer.service.callRefresh = function () {
			const selectedModelId = modelViewerModelSelectionService.getSelectedModelId(); // Retrieve selected model ID
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'model/FilterTrees/RefreshTree',
				params: { modelId: selectedModelId }
			}).then(function (response) {
				return response;
			}, function (error) {
				$log.error(error);
			});
		};
	}
})(angular);
