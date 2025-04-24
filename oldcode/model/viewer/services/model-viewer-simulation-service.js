/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelViewerSimulationService
	 * @function
	 *
	 * @description This service is a function that creates and registers an event processor that links the simulation
	 *              to the currently selected model. The service registers an object selector category with id
	 *              `simulation`.
	 */
	angular.module('model.viewer').factory('modelViewerSimulationService', ['_', 'modelViewerModelSelectionService',
		'modelSimulationMasterService', 'modelViewerObjectIdMapService', 'modelViewerSelectorService',
		'modelViewerObjectTreeService', 'modelViewerModelIdSetService', 'modelSimulationFilterService',
		'basicsCommonDrawingUtilitiesService',
		function (_, modelViewerModelSelectionService, modelSimulationMasterService, modelViewerObjectIdMapService,
		          modelViewerSelectorService, modelViewerObjectTreeService, modelViewerModelIdSetService,
		          modelSimulationFilterService, basicsCommonDrawingUtilitiesService) {

			var state = {};

			function applyMeshColor(changeColorMap, ev) {
				if (angular.isNumber(ev.data.color)) {
					var cl = {
						color: basicsCommonDrawingUtilitiesService.intToRgbColor(ev.data.color)
					};

					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelMeshIds = ev.data.meshIds[subModelId];
						if (modelMeshIds) {
							modelMeshIds.forEach(function (meshId) {
								changeColorMap[subModelId][meshId] = cl;
							});
						}
					});
				}
			}

			var ep = {
				id: 'model.viewer.object',
				begin: function (ev) {
					var filter = modelSimulationFilterService.getFilterByTimelineId(ev.timelineId);
					if (filter) {
						var changeMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();
						var changeColorMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();

						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelMeshIds = ev.data.meshIds[subModelId];
							if (modelMeshIds) {
								var modelChangeMap = changeMap[subModelId];
								switch (ev.data.action) {
									case 'v':
										modelChangeMap.addFromArray(modelMeshIds, '+');
										break;
									case 'h':
										modelChangeMap.addFromArray(modelMeshIds, '-');
										break;
									case 'm':
										modelChangeMap.addFromArray(modelMeshIds, '~');
										break;
									case 't':
										modelChangeMap.addFromArray(modelMeshIds, 't');
										break;
								}
							}
						});

						applyMeshColor(changeColorMap, ev);

						var filterResults = filter.getResultController();
						filterResults.updateMeshStates(changeMap);
						filterResults.updateMeshHints(changeColorMap);
					}
				},
				invertBegin: function (ev) {
					var filter = modelSimulationFilterService.getFilterByTimelineId(ev.timelineId);
					if (filter) {
						var changeMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();
						var changeColorMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();

						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelMeshIds = ev.data.meshIds[subModelId];
							if (modelMeshIds) {
								var modelChangeMap = changeMap[subModelId];
								switch (ev.data.action) {
									case 'v':
										modelChangeMap.addFromArray(modelMeshIds, 'e');
										break;
									case 'h':
										modelChangeMap.addFromArray(modelMeshIds, 'i');
										break;
									case 'm':
										modelChangeMap.addFromArray(modelMeshIds, 'i');
										break;
									case 't':
										modelChangeMap.addFromArray(modelMeshIds, 'e');
										break;
								}

								modelMeshIds.forEach(function (meshId) {
									changeColorMap[subModelId][meshId] = null;
								});
							}
						});

						var filterResults = filter.getResultController();
						filterResults.updateMeshStates(changeMap);
						filterResults.updateMeshHints(changeColorMap);
					}
				},
				end: function (ev) {
					var filter = modelSimulationFilterService.getFilterByTimelineId(ev.timelineId);
					if (filter) {
						var changeMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();
						var changeColorMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();

						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelMeshIds = ev.data.meshIds[subModelId];
							if (modelMeshIds) {
								var modelChangeMap = changeMap[subModelId];
								switch (ev.data.action) {
									case 'v':
										modelChangeMap.addFromArray(modelMeshIds, 'i');
										break;
									case 'h':
										modelChangeMap.addFromArray(modelMeshIds, 'e');
										break;
									case 'm':
										modelChangeMap.addFromArray(modelMeshIds, 'i');
										break;
									case 't':
										modelChangeMap.addFromArray(modelMeshIds, 'e');
										break;
								}

								modelMeshIds.forEach(function (meshId) {
									changeColorMap[subModelId][meshId] = null;
								});
							}
						});

						var filterResults = filter.getResultController();
						filterResults.updateMeshStates(changeMap);
						filterResults.updateMeshHints(changeColorMap);
					}
				},
				invertEnd: function (ev) {
					var filter = modelSimulationFilterService.getFilterByTimelineId(ev.timelineId);
					if (filter) {
						var changeMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();
						var changeColorMap = new modelViewerModelIdSetService.ObjectIdSet().normalizeToMaps();

						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelMeshIds = ev.data.meshIds[subModelId];
							if (modelMeshIds) {
								var modelChangeMap = changeMap[subModelId];
								switch (ev.data.action) {
									case 'v':
										modelChangeMap.addFromArray(modelMeshIds, '+');
										break;
									case 'h':
										modelChangeMap.addFromArray(modelMeshIds, '-');
										break;
									case 'm':
										modelChangeMap.addFromArray(modelMeshIds, '~');
										break;
									case 't':
										modelChangeMap.addFromArray(modelMeshIds, 't');
										break;
								}
							}
						});

						applyMeshColor(changeColorMap, ev);

						var filterResults = filter.getResultController();
						filterResults.updateMeshStates(changeMap);
						filterResults.updateMeshHints(changeColorMap);
					}
				},
				getFinalSnapshot: function (evtIterator, globalData, timelineId) {
					var treeInfo = modelViewerObjectTreeService.getTree();
					if (treeInfo) {
						var visMap = treeInfo.createMeshIdMap('i');

						var meshCount = (function () {
							var result = 0;
							Object.keys(visMap).forEach(function (subModelId) {
								result += visMap[subModelId].count();
							});
							return result;
						})();

						var assignedValues = modelViewerModelSelectionService.forEachSubModel(function () {
							return {};
						});
						var assignedValueCount = 0;

						var addIdAction = function (subModelId, id) {
							if (!assignedValues[subModelId][id]) {
								switch (evt.data.action) {
									case 'v':
										visMap[subModelId][id] = 'i';
										assignedValues[subModelId][id] = true;
										assignedValueCount++;
										break;
									case 'h':
										visMap[subModelId][id] = 'e';
										assignedValues[subModelId][id] = true;
										assignedValueCount++;
										break;
									case 'm':
										visMap[subModelId][id] = 'i';
										assignedValues[subModelId][id] = true;
										assignedValueCount++;
										break;
									case 't':
										visMap[subModelId][id] = 'e';
										assignedValues[subModelId][id] = true;
										assignedValueCount++;
										break;
								}
							}
						};

						var addSubModelIdsAction = function (subModelId) {
							evt.data.meshIds[subModelId].forEach(function (id) {
								addIdAction(subModelId, id);
							});
						};

						var evt;
						// eslint-disable-next-line no-cond-assign
						while (evt = evtIterator()) { // jshint ignore:line
							Object.keys(evt.data.meshIds).forEach(addSubModelIdsAction);
							if (assignedValueCount >= meshCount) {
								break;
							}
						}
						return function () {
							var filter = modelSimulationFilterService.getFilterByTimelineId(timelineId);
							if (filter) {
								filter.getResultController().updateMeshStates(visMap);
							}
						};
					} else {
						return function () {
						};
					}
				},
				applySnapshot: function (snapshot) {
					snapshot();
				},
				suspendUpdates: function () {
					modelSimulationFilterService.suspendAllUpdates();
				},
				resumeUpdates: function () {
					modelSimulationFilterService.resumeAllUpdates();
				},
				getContextOptions: function () {
					var selModelId = modelViewerModelSelectionService.getSelectedModelId();
					if (selModelId) {
						return {
							modelId: selModelId
						};
					} else {
						return {};
					}
				},
				loadTimeline: function (evtIterator, globalData) {
					var evt;
					// eslint-disable-next-line no-cond-assign
					while (evt = evtIterator()) { // jshint ignore:line
						evt.data.meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(evt.data.mIds).useSubModelIds();
					}

					if (angular.isArray(globalData.remainingMeshes) && (globalData.remainingMeshes.length > 0)) {
						state.remainingMeshes = globalData.remainingMeshes;
					} else {
						state.remainingMeshes = null;
					}
				}
			};
			modelSimulationMasterService.registerEventProcessor(ep);

			modelViewerSelectorService.registerCategory({
				id: 'simulation',
				name: 'model.viewer.selectors.simulationCategory'
			});
			modelViewerSelectorService.registerSelector({
				name: 'model.viewer.selectors.remainingSimObjects.name',
				category: 'simulation',
				isAvailable: function () {
					return angular.isObject(state.remainingObjects);
				},
				getObjects: function () {
					return {
						meshIds: angular.isObject(state.remainingObjects) ? _.cloneDeep(state.remainingObjects) : {}
					};
				}
			});

			return ep;
		}]);
})(angular);
