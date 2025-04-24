/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelMainObjectSet2ObjectDataService
	 * @function
	 *
	 * @description Loads model object attributes.
	 */
	angular.module('model.main').service('modelMainObjectSet2ObjectDataService', ['_', 'platformDataServiceFactory',
		'modelViewerModelSelectionService', 'modelMainObjectSetDataService', '$http', 'platformObservableService',
		'modelViewerModelIdSetService', 'modelViewerCompositeModelObjectSelectionService',
		'modelViewerObjectIdMapService', '$log',
		function (_, platformDataServiceFactory, modelSelectionService, modelMainObjectSetDataService, $http,
		          platformObservableService, modelViewerModelIdSetService,
		          modelViewerCompositeModelObjectSelectionService, modelViewerObjectIdMapService, $log) {
			var svcOptions = {
				flatLeafItem: {
					module: angular.module('model.main'),
					serviceName: 'modelMainObjectSet2ObjectDataService',
					entityNameTranslationID: 'model.main.objectSet2ObjectEntity',
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/objectset2object/',
						endRead: 'listbyobjectset',
						initReadData: function (readData) {
							var objectSetId;
							if (modelMainObjectSetDataService.hasSelection()) {
								var item = modelMainObjectSetDataService.getSelected();
								if (item) {
									objectSetId = item.Id;
									var modelId = null;
									readData.filter = '?projectId=' + item.ProjectFk + '&objectSetId=' + objectSetId + '&modelId=' + modelId;
								}
							}
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'model/main/objectset2object/'
					},
					actions: {
						delete: true,
						create: 'false'
					},
					entityRole: {
						leaf: {
							itemName: 'ObjectSet2Object',
							parentService: modelMainObjectSetDataService
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
								var modelId = modelSelectionService.getSelectedModelId();
								if (modelId) {
									creationData.PKey1 = modelId;
									if (modelMainObjectSetDataService.hasSelection()) {
										var item = modelMainObjectSetDataService.getSelected();
										creationData.PKey1 = item.ModelFk;
									}
								}
							},
							handleCreateSucceeded: function (newData) {
								if (modelMainObjectSetDataService.hasSelection()) {
									var item = modelMainObjectSetDataService.getSelected();
									newData.ObjectSetFk = item.Id;
									newData.ProjectFk = item.ProjectFk;
								}
								return newData;
							}

						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createService(svcOptions, this);
			var service = serviceContainer.service;

			/**
			 * @ngdoc method
			 * @name assignObjects
			 * @function
			 * @methodOf modelMainObjectSet2ObjectDataService
			 * @description Assigns a set of objects to a given object set.
			 * @param {Object} config A configuration object for the operation. The following properties are supported:
			 *                        - `ModelId`: The model ID.
			 *                        - `ObjectSetId`: The object set ID. If this value is not set, a new object set
			 *                                         will be created.
			 *                        - `ObjectSetCreationParams`: If no object set ID is specified, an object with
			 *                                                     parameters used for the creation of a new object
			 *                                                     set. The required properties are `Name`, `TypeFk`,
			 *                                                     and `StatusFk`.
			 *                        - `KindOfIds`: Either `m` for mesh IDs or `o` for object IDs.
			 *                        - `MeshIds`: An array of mesh IDs.
			 *                        - `ObjectIds`: An array of object IDs.
			 * @return {Promise} A promise that is resolved when the operation has been completed.
			 */
			service.assignObjects = function (config) {
				return $http.post(globals.webApiBaseUrl + 'model/main/objectset2object/assignobjects', config)
					.then(function (response) {
						modelMainObjectSetDataService.addItemIfAppropriate(response.data.ObjectSet);

						if (modelMainObjectSetDataService.hasSelection()) {
							var selected = modelMainObjectSetDataService.getSelected();
							if (selected && selected.Id === response.data.ObjectSet.Id &&
								selected.ProjectFk === response.data.ObjectSet.ProjectFk) {
								var list = service.getList();
								angular.forEach(response.data.AssignedObjects, function (item) {
									var exist = _.find(list, {'ModelFk': item.ModelFk, 'ObjectFk': item.ObjectFk});
									if (!exist) {
										list.push(item);
									} else {
										_.assign(exist, item);
									}
								});
								service.gridRefresh();
							}
						}
						return true;
					});
			};

			service.updateModelSelection = platformObservableService.createObservableBoolean();
			service.updateModelSelection.uiHints = {
				id: 'toggleObjectSelection',
				caption$tr$: 'model.main.selectObjects',
				iconClass: 'tlb-icons ico-view-select'
			};

			function updateModelSelectionIfRequired() {
				if (service.updateModelSelection.getValue()) {
					var selModel = modelSelectionService.getSelectedModel();
					if (selModel) {
						var selItems = service.getSelectedEntities();

						var selObjects = new modelViewerModelIdSetService.MultiModelIdSet();
						selItems.forEach(function (item) {
							var subModelId = selModel.globalModelIdToSubModelId(item.ModelFk);
							if (_.isNumber(subModelId)) {
								var modelSelObjects = selObjects[subModelId];
								if (!modelSelObjects) {
									modelSelObjects = selObjects[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
								}
								modelSelObjects[item.ObjectFk] = true;
							}
						});
						modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selObjects);

						$log.info(selItems);
						/*
						$http.get(globals.webApiBaseUrl + 'model/main/objectset/modelObjectsFromObjectSets', {
							params: {
								modelId: selModelId,
								objectSetIds: _.map(selItems, function (objSet) {
									return objSet.Id;
								}).join(':')
							}
						}).then(function (response) {
							if (_.isEmpty(response.data)) {
								modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds();
							} else {
								var resultMap = modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data);
								resultMap = resultMap.useSubModelIds();
								modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(resultMap);
							}
						});
						*/
					}
				}
			}

			service.updateModelSelection.registerValueChanged(updateModelSelectionIfRequired);
			service.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);
		}]);
})(angular);
