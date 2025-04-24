/*
 * $Id: model-viewer-filter-by-main-entity-service.js 386243 2016-07-28 08:45:32Z wwa $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainModelFilterService', ['_', '$http', '$injector',
		'modelViewerModelSelectionService', 'PlatformMessenger', 'modelViewerObjectTreeService',
		'modelViewerModelIdSetService', 'modelViewerViewerRegistryService',
		'modelViewerCompositeModelObjectSelectionService',
		function (_, $http, $injector,
			modelSelectionService, PlatformMessenger, modelViewerObjectTreeService,
			modelViewerModelIdSetService, modelViewerViewerRegistryService,
			modelViewerCompositeModelObjectSelectionService) {
			var selModelId = null;

			var filterFunc = function filterModelByConstructionSystemMain(results) {
				if (selModelId) {
					var constructionSystemMainInstanceService = $injector.get('constructionSystemMainInstanceService');
					var res = _.map(_.filter(constructionSystemMainInstanceService.getList(), function (item) {
						return item.IsChecked;
					}), function (item) {
						return item.Id;
					});

					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'constructionsystem/main/instance/objectids',
						data: {
							modelId: selModelId,
							mainEntityIds: res
						}
					}).then(function (result) {
						if (result.status === 200) {
							// when model selection service is ready then execute code below.
							if (modelSelectionService.getSelectedModelId()) {
								var treeInfo = modelViewerObjectTreeService.getTree();
								if (treeInfo) {
									var objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(result.data).useSubModelIds();
									var meshIds = treeInfo.objectToMeshIds(objectIds);
									results.setIncludedMeshIds(meshIds);
									return objectIds.useGlobalModelIds();
								}

							}
							return new modelViewerModelIdSetService.ObjectIdSet();
						} else { // jshint ignore:line
							// TODO: error handling
						}
					});
				} else {
					results.excludeAll();
				}
			};

			var service = filterFunc;

			service.setCurrentModelId = function (modelId) {
				selModelId = modelId;
			};

			service.setSelectionOnViewer = function setSelectionOnViewer(e, arg, flag, gridItemList) {
				if (modelViewerViewerRegistryService.isViewerActive()) {
					var selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();
					modelSelectionService.forEachSubModel(function (subModelId) {
						selectedObjectIds[subModelId] = [];
					});
					if (arg && arg.rows && arg.rows.length > 0) {
						if (_.keys(selectedObjectIds).length > 0) {
							selectedObjectIds = selectedObjectIds.useGlobalModelIds();

							angular.forEach(arg.rows, function (rowItem) {
								var item = gridItemList[rowItem];
								if (item) {
									var modelId = getModelId(item, flag);
									var objectId = getObjectId(item, flag);
									if (Object.prototype.hasOwnProperty.call(selectedObjectIds,modelId)) {
										var hlpArr = selectedObjectIds[modelId];
										hlpArr.push(objectId);
										selectedObjectIds[modelId] = hlpArr;
									} else {
										var arr = [];
										arr.push(objectId);
										selectedObjectIds[modelId] = arr;
									}
								}
							});
						}
					}
					if (!selectedObjectIds.isEmpty()) {
						modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selectedObjectIds.useSubModelIds());
					} else {
						service.emptySelection();
					}
				}
			};

			function getObjectId(item, flag) {
				if (flag === 'assignedObj') {
					return item.ObjectFk;
				}else if (flag === 'lineItemObject'){
					return item.MdlObjectFk;
				}else if (flag === 'mainObject') {
					return item.Id;
				}
			}

			function getModelId(item, flag) {
				if (flag === 'lineItemObject') {
					return item.MdlModelFk;
				}  else {
					return item.ModelFk;
				}
			}

			service.setSelectionOnViewerByList = function setSelectionOnViewer(dataList, getModelFk, getObjectId) {
				if (modelViewerViewerRegistryService.isViewerActive()) {
					var selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();
					modelSelectionService.forEachSubModel(function (subModelId) {
						selectedObjectIds[subModelId] = [];
					});
					if (dataList && dataList.length > 0) {
						if (_.keys(selectedObjectIds).length > 0) {
							selectedObjectIds = selectedObjectIds.useGlobalModelIds();

							angular.forEach(dataList, function (item) {
								if (item) {
									var modelFk = getModelFk ? getModelFk(item) : item.ModelFk;
									var objectId = getObjectId ? getObjectId(item) : item.ObjectFk;
									if (Object.prototype.hasOwnProperty.call(selectedObjectIds,modelFk)) {
										selectedObjectIds[modelFk].push(objectId);
									} else {
										selectedObjectIds[modelFk] = [objectId];
									}
								}
							});
						}
					}
					if (!selectedObjectIds.isEmpty()) {
						modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selectedObjectIds.useSubModelIds());
					} else {
						service.emptySelection();
					}
				}
			};

			service.emptySelection = function () {
				if (modelViewerViewerRegistryService.isViewerActive()) {
					modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds();
				}
			};

			service.getObjectIdsBy3DViewerFilterId = function (/* filterId */) {
				var objectIds = [];
				// when model selection service is ready then execute code below.
				// TODO: adapt to new filtering infrastructure
				/* if (modelSelectionService.getSelectedModelId()) {
					//var result = {};
					/*var modelObjectSet = modelViewerObjectFilterService.filterById[filterId].getIncludedObjects();
					var treeInfo = modelViewerObjectTreeService.getTree();
					if (treeInfo) {
						result = treeInfo.meshToObjectIds(modelObjectSet).useGlobalModelIds();

						collectObjectIds(result, objectIds);

						result = treeInfo.meshToMinimalObjectIds(modelObjectSet).useGlobalModelIds();

						collectObjectIds(result, objectIds);
					}
				} */
				return objectIds;
			};
			/*
			function collectObjectIds(ObjectSet, objectIds) {
				for (var modelId in ObjectSet) {
					if (ObjectSet.hasOwnProperty(modelId)) {
						var tempObjectIds = ObjectSet[modelId];
						if (tempObjectIds && tempObjectIds.length > 0) {
							angular.forEach(tempObjectIds, function (objectId) {
								objectIds.push({'id': objectId, 'modelId': modelId});
							});
						}
					}
				}
			}
			*/

			// TODO: adapt to new filtering infrastructure
			// service.registerFilteredObjectsChanged = modelViewerObjectFilterService.registerFilteredObjectsChanged;
			// service.unregisterFilteredObjectsChanged = modelViewerObjectFilterService.unregisterFilteredObjectsChanged;
			service.registerFilteredObjectsChanged = function () {
				console.log('WARNING: Temporarily not implemented.');
			};
			service.unregisterFilteredObjectsChanged = service.registerFilteredObjectsChanged;

			service.onSelectedObjectIdsChanged = new PlatformMessenger();

			service.selectedObjectIds = null;

			service.getSelectedObjectIds = function () {
				return service.selectedObjectIds;
			};

			service.setSelectedObjectIds = function (ids) {
				service.selectedObjectIds = ids;
			};

			service.clearSelectedObjectIds = function () {
				service.selectedObjectIds = null;
			};


			return service;

		}]);
})();
