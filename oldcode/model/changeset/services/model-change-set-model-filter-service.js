/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangesetModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Model Change Set module.
	 */
	angular.module('model.changeset').factory('modelChangesetModelFilterService', modelChangesetModelFilterService);

	modelChangesetModelFilterService.$inject = ['$http', 'modelChangeSetDataService', 'modelViewerModelSelectionService',
		'modelViewerObjectTreeService', 'modelViewerModelIdSetService'];

	function modelChangesetModelFilterService($http, modelChangeSetDataService, modelViewerModelSelectionService,
		modelViewerObjectTreeService, modelViewerModelIdSetService) {
		
		function addObjectsAsMeshesWithValue(compressedString, val, destMap) {
			if (compressedString) {
				const objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(compressedString).useSubModelIds();
				const treeInfo = modelViewerObjectTreeService.getTree();
				const meshIds = treeInfo.objectToMeshIds(objectIds);
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					const modelMeshIds = meshIds[subModelId];
					if (modelMeshIds) {
						const modelDestMap = destMap[subModelId];
						modelDestMap.addFromArray(modelMeshIds, val);
					}
				});
			}
		}

		const data = {
			filterFunc: function filterModelByModelChangeSet(results) {
				const selChangeSet = modelChangeSetDataService.getSelected();
				const selModel = modelViewerModelSelectionService.getSelectedModel();
				const treeInfo = modelViewerObjectTreeService.getTree();

				if (selChangeSet && selModel && treeInfo && selModel.subModels.some(function (sm) {
					return (selChangeSet.ModelFk === sm.info.modelId) || (selChangeSet.ModelCmpFk === sm.info.modelId);
				})) {
					return $http.get(globals.webApiBaseUrl + 'model/change/objectchanges?modelId=' + selChangeSet.ModelFk + '&changeSetId=' + selChangeSet.Id).then(function (response) {
						const idMap = treeInfo.createMeshIdMap('e');
						addObjectsAsMeshesWithValue(response.data.c, 'i', idMap);
						addObjectsAsMeshesWithValue(response.data.m1, 'i', idMap);
						addObjectsAsMeshesWithValue(response.data.m2, 'i', idMap);
						results.updateMeshStates(idMap);
					});
				} else {
					results.excludeAll();
				}
			}
		};

		data.filterFunc.addObjectsAsMeshesWithValue = addObjectsAsMeshesWithValue;

		return data.filterFunc;
	}
})(angular);
