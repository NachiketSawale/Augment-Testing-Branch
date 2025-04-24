/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsRuntimeDataService
	 * @function
	 *
	 * @description Enriches a HOOPS viewer with some additional data specific to the viewer and the loaded model.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsRuntimeDataService', modelViewerHoopsRuntimeDataService);

	modelViewerHoopsRuntimeDataService.$inject = ['$q', 'modelViewerObjectTreeService',
		'modelViewerHoopsLinkService', 'modelViewerModelSelectionService', 'Communicator',
		'modelViewerObjectIdMapService', 'modelViewerModelSettingsService', '$log', '$timeout', '$http', '_'];

	function modelViewerHoopsRuntimeDataService($q, modelViewerObjectTreeService,
		modelViewerHoopsLinkService, modelViewerModelSelectionService, Communicator,
		modelViewerObjectIdMapService, modelViewerModelSettingsService, $log, $timeout, $http, _) {

		const service = {};

		const infoPropertyName = 'rib$rtData';

		function prepareDefaultValuesContainer() {
			return {
				byViewerIds: {},
				byMeshIds: modelViewerModelSelectionService.forEachSubModel(function () {
					return new modelViewerObjectIdMapService.ObjectIdMap();
				})
			};
		}

		function storeDefaultValues(viewer, allMeshNodeIds, values) {
			const result = prepareDefaultValuesContainer();
			allMeshNodeIds.forEach(function (nodeId, index) {
				const defValue = values[index];
				result.byViewerIds[nodeId] = defValue;
				const id = modelViewerHoopsLinkService.viewerToMeshId(viewer, nodeId);
				result.byMeshIds[id.subModelId][id.meshId] = defValue;
			});
			return result;
		}

		function storeDefaultValuesFromDb(viewer, selModel, treeInfo, allValues) {
			function arrayToMap(array, keyName) {
				const meshMap = {};
				array.forEach(function (item) {
					meshMap[item[keyName]] = item;
				});
				return meshMap;
			}

			const valuesByModel = arrayToMap(allValues, 'm');

			const resultContainer = {
				defaultFaceColors: prepareDefaultValuesContainer(),
				defaultTransparencies: prepareDefaultValuesContainer(),
				defaultVisibilities: prepareDefaultValuesContainer()
			};

			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				const modelId = selModel.bySubModelId[subModelId].info.modelId;
				const modelTreeInfo = treeInfo[subModelId];
				const modelDefValues = valuesByModel[modelId];
				if (modelTreeInfo && modelDefValues) {
					const modelMeshIds = modelTreeInfo.allMeshIds();

					const colorMap = _.map(modelDefValues.c, function (cl) {
						return new Communicator.Color(cl.r, cl.g, cl.b);
					});

					const colorIndexesByMeshId = arrayToMap(modelDefValues.i, 'm');
					const otherValuesByMeshId = arrayToMap(modelDefValues.o, 'm');

					modelMeshIds.forEach(function (meshId) {
						const nodeId = modelViewerHoopsLinkService.meshToViewerId(viewer, {
							subModelId: subModelId,
							meshId: meshId
						});

						let val = otherValuesByMeshId[meshId];
						if (val) {
							resultContainer.defaultTransparencies.byMeshIds[subModelId][meshId] = val.o;
							resultContainer.defaultTransparencies.byViewerIds[nodeId] = val.o;
							resultContainer.defaultVisibilities.byMeshIds[subModelId][meshId] = val.v;
							resultContainer.defaultVisibilities.byViewerIds[nodeId] = val.v;
						}

						val = colorIndexesByMeshId[meshId];
						if (val) {
							const cl = colorMap[val.i];
							resultContainer.defaultFaceColors.byMeshIds[subModelId][meshId] = cl;
							resultContainer.defaultFaceColors.byViewerIds[nodeId] = cl;
						}
					});
				} else {
					$log.warn('Model ' + modelId + ': tree initialized = ' + Boolean(modelTreeInfo) + '; default values supplied = ' + Boolean(modelDefValues));
				}
			});

			return resultContainer;
		}

		function storeMarkerShapesFromDb(markerShapesValues) {

			const resultContainer = {
				markerShapeIdDefault: null,
				markerShapeList: []
			};

			_.each(markerShapesValues, function (val) {
				if (val.IsDefault){
					resultContainer.markerShapeIdDefault = val.Id;
				}
				resultContainer.markerShapeList.push(val);
			});

			return resultContainer;
		}
		/**
		 * @ngdoc method
		 * @name prepareViewer
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Attaches additional data for use at runtime to a given viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Promise} A promise that is resolved once the data is ready.
		 */
		service.prepareViewer = function (viewer) {
			if (viewer) {
				return viewer.waitForIdle().then(function () {
					const info = {};

					const infoPromises = [];

					const mdl = viewer.model;
					const treeInfo = modelViewerObjectTreeService.getTree();
					const selModel = modelViewerModelSelectionService.getSelectedModel();

					infoPromises.push(mdl.getModelBounding(false, false).then(function (box) {
						info.boundingBox = box;
					}));

					if (selModel && treeInfo) { // no tree info available for SCS models
						if (_.every(selModel.subModels, function (sm) {
							return Boolean(sm.info.hasMeshPresentationInfo);
						})) {
							infoPromises.push($http.get(globals.webApiBaseUrl + 'model/main/object3d/defaultpresentationinfo', {
								params: {
									modelIds: _.join(_.map(selModel.subModels, function (sm) {
										return sm.info.modelId;
									}), ':')
								}
							}).then(function (response) {
								_.assign(info, storeDefaultValuesFromDb(viewer, selModel, treeInfo, response.data));
								$log.info('combined default values package done.');
							}));
						} else {
							const allMeshIds = treeInfo.allMeshIds();
							const allMeshNodeIds = modelViewerHoopsLinkService.meshToViewerIds(viewer, allMeshIds);

							infoPromises.push(viewer.model.getNodesEffectiveVisibility(allMeshNodeIds).then(function (visibilities) {
								info.defaultVisibilities = storeDefaultValues(viewer, allMeshNodeIds, visibilities);
								$log.info('visibilities done.');
							}));

							infoPromises.push($timeout(function () {
							}, 800).then(function () {
								return viewer.model.getNodesEffectiveFaceColor(allMeshNodeIds).then(function (colors) {
									info.defaultFaceColors = storeDefaultValues(viewer, allMeshNodeIds, colors);
									$log.info('colors done.');
								});
							}));

							infoPromises.push($timeout(function () {
							}, 800).then(function () {
								return viewer.model.getNodesEffectiveOpacity(allMeshNodeIds, Communicator.ElementType.Faces).then(function (transparencies) {
									info.defaultTransparencies = storeDefaultValues(viewer, allMeshNodeIds, transparencies);
									$log.info('transparencies done.');
								});
							}));
						}

						infoPromises.push($timeout(function () {
						}, 800).then(function () {
							return $http({
								method: 'GET',
								url: globals.webApiBaseUrl + 'basics/customize/modelmarkershape/list'
							}).then(function (response) {
								if (angular.isObject(response.data)) {
									_.assign(info, storeMarkerShapesFromDb(response.data));
									$log.info('marker shapes done.');
								}
							});
						}));
					}

					if (selModel) {
						(function loadDisplaySettings() {
							const settingsLoadedDeferred = $q.defer();

							const settingsLoaded = function () {
								info.displaySettings = modelViewerModelSettingsService.getSettingsPart('displaySettings');
								modelViewerModelSettingsService.untrackSettings(settingsLoaded, ['displaySettings']);
								settingsLoadedDeferred.resolve();
							};

							modelViewerModelSettingsService.trackSettings(settingsLoaded, ['displaySettings']);
							infoPromises.push(settingsLoadedDeferred.promise);
						})();
					}

					let resultPromise = $q.when();
					infoPromises.forEach(function (promise) {
						resultPromise = resultPromise.then(function () {
							return promise;
						});
					});
					resultPromise = resultPromise.then(function () {
						viewer[infoPropertyName] = info;
					});
					return resultPromise;
				});
			} else {
				return $q.when(true);
			}
		};

		/**
		 * @ngdoc method
		 * @name getBoundingBox
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Retrieves the bounding box of the model in a given viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Communicator.Box} A copy of the bounding box.
		 */
		service.getBoundingBox = function (viewer) {
			return viewer[infoPropertyName].boundingBox.copy();
		};

		/**
		 * @ngdoc method
		 * @name getDefaultVisibilities
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Gets the default visibilities for meshes in the viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Object} An object with a `byViewerIds` and a `byMeshIds` property.
		 */
		service.getDefaultVisibilities = function (viewer) {
			return viewer[infoPropertyName].defaultVisibilities;
		};

		/**
		 * @ngdoc method
		 * @name getDefaultColors
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Gets the default colors for meshes in the viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Object} An object with a `byViewerIds` and a `byMeshIds` property.
		 */
		service.getDefaultColors = function (viewer) {
			return viewer[infoPropertyName].defaultFaceColors;
		};

		/**
		 * @ngdoc method
		 * @name getDefaultTransparencies
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Gets the default transparencies for meshes in the viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Object} An object with a `byViewerIds` and a `byMeshIds` property.
		 */
		service.getDefaultTransparencies = function (viewer) {
			return viewer[infoPropertyName].defaultTransparencies;
		};

		/**
		 * @ngdoc method
		 * @name getMarkerShapeIdDefault
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Gets the default marker shape in the viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Object} Geometry points of the mesh in json format.
		 */
		service.getMarkerShapeIdDefault = function (viewer) {
			return viewer[infoPropertyName].markerShapeIdDefault;
		};

		/**
		 * @ngdoc method
		 * @name getMarkerShapeList
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Gets the marker shape in the viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Object} Array of Geometry points of the mesh in json format.
		 */
		service.getMarkerShapeList = function (viewer) {
			return viewer[infoPropertyName].markerShapeList;
		};

		/**
		 * @ngdoc method
		 * @name getMarkerShapeById
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Gets the marker shape in the viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Number} id Id.
		 * @returns {Object} Geometry points of the mesh in json format.
		 */
		service.getMarkerShapeById = function (viewer, id) {
			return viewer[infoPropertyName].markerShapeList.filter(x => x.Id === id);
		};

		/**
		 * @ngdoc method
		 * @name getDisplaySettings
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Gets the display settings for the model in the viewer.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Object} An object that contains the display settings.
		 */
		service.getDisplaySettings = function (viewer) {
			return _.cloneDeep(viewer[infoPropertyName].displaySettings);
		};

		/**
		 * @ngdoc method
		 * @name isRuntimeDataReady
		 * @function
		 * @methodOf modelViewerHoopsRuntimeDataService
		 * @description Checks whether runtime data for a given viewer has been loaded.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @returns {Boolean} A value that indicates whether the runtime data is ready for use.
		 */
		service.isRuntimeDataReady = function (viewer) {
			return Boolean(viewer[infoPropertyName]);
		};

		return service;
	}
})(angular);
