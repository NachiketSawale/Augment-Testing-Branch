/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimate.main.estimateMainObjectSelectorService
	 * @function
	 * @requires $http, modelViewerSelectorService, modelViewerModelSelectionService, modelViewerObjectTreeService,
	 *           modelViewerModelIdSetService, modelViewerCompositeModelObjectSelectionService,
	 *           estimateMainPinnableEntityService
	 *
	 * @description Registers object selectors related to the Estimate module.
	 */
	angular.module('estimate.main').factory('estimateMainObjectSelectorService',
		['$http', 'modelViewerSelectorService', 'modelViewerModelSelectionService', 'modelViewerObjectTreeService',
			'modelViewerModelIdSetService', 'modelViewerCompositeModelObjectSelectionService',
			'estimateMainPinnableEntityService',
			function ($http, modelViewerSelectorService, modelViewerModelSelectionService, modelViewerObjectTreeService,
				modelViewerModelIdSetService, modelViewerCompositeModelObjectSelectionService,
				estimateMainPinnableEntityService) {
				let service = {
					estimateCategoryId: 'estimate'
				};

				modelViewerSelectorService.registerCategory({
					id: service.estimateCategoryId,
					name: 'estimate.main.modelObjectSelectors.category'
				});

				modelViewerSelectorService.registerSelector({
					name: 'estimate.main.modelObjectSelectors.selectUnassigned.name',
					category: service.estimateCategoryId,
					isAvailable: function () {
						let headerId = estimateMainPinnableEntityService.getPinned();
						let selectedModel = modelViewerModelSelectionService.getSelectedModel();
						return !!headerId && !!selectedModel;
					},
					getObjects: function () {
					// This function must supply arrays or object ID maps (in an object ID set) of object IDs
					// that are not assigned to any line items (in the pinned estimate header or so? Please check with
					// appropriate PMs).
					// Use the modelViewerObjectTreeService for the complete list of IDs.
					// If asynchronous evaluation is required, the resulting object may also be returned in a promise.
						let selectedModel = modelViewerModelSelectionService.getSelectedModel();
						if (selectedModel) {
							let data = {
								EstHeaderFk: estimateMainPinnableEntityService.getPinned(),
								MdlModelFk: selectedModel.info.modelId
							};
							if (!data.viewerPromise) {
								data.viewerPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/allsubmodelobjectids', [data]);
								return data.viewerPromise.then(function (response) {
									let treeInfo = modelViewerObjectTreeService.getTree();
									if (treeInfo) {
										data.viewerPromise = null;
										let objectIds = treeInfo.invertObjectIds(modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds(), true);
										return {
											objectIds: objectIds
										};
									}
								});
							}
						}
					}
				});

				service.selectAssignedObject = function (assignedObjects) {
					if (modelViewerModelSelectionService.getSelectedModelId()) {
						if(assignedObjects && assignedObjects.length){
							let selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();

							modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
								selectedObjectIds[subModelId] = [];
							});

							selectedObjectIds = selectedObjectIds.useGlobalModelIds();

							assignedObjects.forEach(function (assignedObject) {
								if(angular.isArray(selectedObjectIds[assignedObject.MdlModelFk])){
									selectedObjectIds[assignedObject.MdlModelFk].push(assignedObject.MdlObjectFk);
								}
							});

							if (!selectedObjectIds.isEmpty()) {
								modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selectedObjectIds.useSubModelIds());
							}
						}
						else {
							modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds();
						}
					}
				};

				return service;

			}]);
})();
