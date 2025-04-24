/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.change.modelChangeModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Model Change module.
	 */
	angular.module('model.change').factory('modelChangeModelFilterService', modelChangeModelFilterService);

	modelChangeModelFilterService.$inject = ['_', 'modelChangeDataService', 'modelViewerModelSelectionService',
		'modelViewerModelIdSetService', 'modelViewerObjectTreeService'];

	function modelChangeModelFilterService(_, modelChangeDataService, modelViewerModelSelectionService,
		modelViewerModelIdSetService, modelViewerObjectTreeService) {

		const data = {
			filterFunc: function filterModelByModelChange(results) {
				let selModel;
				let objectIds;

				function addObjectId(modelId, objectId) {
					const subModelId = selModel.globalModelIdToSubModelId(modelId);
					if (subModelId) {
						let modelObjectIds = objectIds[subModelId];
						if (!modelObjectIds) {
							modelObjectIds = [];
							objectIds[subModelId] = modelObjectIds;
						}
						modelObjectIds.push(objectId);
					}
				}

				selModel = modelViewerModelSelectionService.getSelectedModel();
				if (selModel) {
					objectIds = new modelViewerModelIdSetService.MultiModelIdSet();

					let items = modelChangeDataService.getSelectedEntities();
					if (items.length <= 0) {
						items = modelChangeDataService.getList();
					}

					if (_.isArray(items)) {
						items.forEach(function (item) {
							if (item.ObjectFk) {
								addObjectId(item.ModelFk, item.ObjectFk);
							}
							if (item.ObjectCmpFk) {
								addObjectId(item.ModelCmpFk, item.ObjectCmpFk);
							}
						});
					}

					const treeInfo = modelViewerObjectTreeService.getTree();
					const meshIds = treeInfo.objectToMeshIds(objectIds);
					results.setIncludedMeshIds(meshIds);
				}
			}
		};

		return data.filterFunc;
	}
})(angular);
