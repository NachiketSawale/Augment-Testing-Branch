/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainModelFilterService
	 * @function
	 * @requires _, modelMainObjectDataService, modelViewerModelSelectionService, modelViewerModelIdSetService,
	 *           modelViewerObjectIdMapService, modelViewerObjectTreeService
	 *
	 * @description Represents a filter function for the main entity filter in the Model module.
	 */
	angular.module('model.main').factory('modelMainModelFilterService', ['_', 'modelMainObjectDataService',
		'modelViewerModelSelectionService', 'modelViewerModelIdSetService', 'modelViewerObjectIdMapService',
		'modelViewerObjectTreeService',
		function (_, modelMainObjectDataService, modelViewerModelSelectionService, modelViewerModelIdSetService,
		          modelViewerObjectIdMapService, modelViewerObjectTreeService) {
			return function filterModelByModelMain(results) {
				var objEntities = modelMainObjectDataService.getList();
				if (_.isArray(objEntities)) {
					var globalModelIds = (function () {
						var result = {};

						var selModel = modelViewerModelSelectionService.getSelectedModel();
						if (selModel) {
							selModel.subModels.forEach(function (sm) {
								result[sm.info.modelId] = true;
							});
						}

						return result;
					})();

					var selObjectIds = new modelViewerModelIdSetService.MultiModelIdSet();
					objEntities.forEach(function (obj) {
						if (globalModelIds[obj.ModelFk]) {
							var modelSelObjectIds = selObjectIds[obj.ModelFk];
							if (!modelSelObjectIds) {
								modelSelObjectIds = selObjectIds[obj.ModelFk] = new modelViewerObjectIdMapService.ObjectIdMap();
							}
							modelSelObjectIds[obj.Id] = true;
						}
					});

					var treeInfo = modelViewerObjectTreeService.getTree();
					var selMeshIds = treeInfo.objectToMeshIds(selObjectIds.useSubModelIds());
					results.setIncludedMeshIds(selMeshIds);
				} else {
					results.excludeAll();
				}
			};
		}]);
})(angular);
