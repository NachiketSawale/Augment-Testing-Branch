/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerCompositeModelObjectSelectionService
	 * @function
	 *
	 * @description Stores and manages a set of selected objects in the currently loaded model,
	 *              for models stored in the object hierarchy format. Internally, the set of
	 *              selected objects is stored as a set of object IDs. There is no guarantee
	 *              that any or all of these object IDs match at least one mesh ID. Hence, the
	 *              set of selected objects in a model may be non-empty, even though no 3D
	 *              objects are selected.
	 *              This service supports the new internal model structure (introduced in June 2017) that supports
	 *              composite models (but also non-composite models). It will eventually supersede the simple
	 *              object selection service.
	 */
	angular.module('model.viewer').factory('modelViewerCompositeModelObjectSelectionService',
		modelViewerCompositeModelObjectSelectionService);

	modelViewerCompositeModelObjectSelectionService.$inject = ['_', 'PlatformMessenger',
		'modelViewerModelSelectionService', 'modelViewerObjectIdMapService',
		'modelViewerObjectTreeService', 'modelViewerModelIdSetService'];

	function modelViewerCompositeModelObjectSelectionService(_, PlatformMessenger,
		modelViewerModelSelectionService, modelViewerObjectIdMapService,
		modelViewerObjectTreeService, modelViewerModelIdSetService) {

		const service = {};

		const state = {
			selectedObjectIdMaps: modelViewerModelIdSetService,
			onSelectionChanged: new PlatformMessenger()
		};

		service.resetSelection = function () {
			state.selectedObjectIdMaps = new modelViewerModelIdSetService.ObjectIdSet();
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				state.selectedObjectIdMaps[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
			});
		};

		/**
		 * @ngdoc function
		 * @name registerSelectionChanged
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Registers a function that gets called when the set of
		 *              selected objects has changed.
		 * @param {Function} handler The function to register.
		 */
		service.registerSelectionChanged = function (handler) {
			state.onSelectionChanged.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterSelectionChanged
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Unregisters a function registered with
		 *              `registerSelectionChanged`.
		 * @param {Function} handler The function to unregister.
		 */
		service.unregisterSelectionChanged = function (handler) {
			state.onSelectionChanged.unregister(handler);
		};

		/**
		 * @ngdoc function
		 * @name normalizeToMaps
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Transforms a set of object IDs into an `ObjectIdMap`.
		 * @param {Array<Number>|ObjectIdMap} ids The set of object IDs.
		 * @returns {ObjectIdMap} An object ID map that contains the IDs indicated
		 *                        in the input argument.
		 */
		function normalizeToMaps(ids) {
			const result = new modelViewerModelIdSetService.ObjectIdSet();
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				const orig = ids[subModelId];
				result[subModelId] = (function () {
					if (angular.isArray(orig)) {
						return new modelViewerObjectIdMapService.ObjectIdMap(orig, true);
					} else if (angular.isObject(orig)) {
						return orig.clone();
					} else {
						return new modelViewerObjectIdMapService.ObjectIdMap();
					}
				})();
			});
			return result;
		}

		/**
		 * @ngdoc function
		 * @name updateSelectedObjectIds
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Modifies the selection.
		 * @param {Array<Number>|ObjectIdMap} objectIds The new selection.
		 */
		function updateSelectedObjectIds(objectIds) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			const objectIdMaps = treeInfo.minimizeObjectIds(normalizeToMaps(objectIds), true);

			const subModelIds = _.sortBy(_.map(Object.keys(objectIdMaps), function (subModelId) {
				return parseInt(subModelId);
			}));
			if (_.isEqual(subModelIds, _.sortBy(_.map(Object.keys(state.selectedObjectIdMaps), function (subModelId) {
				return parseInt(subModelId);
			})))) {
				if (_.every(subModelIds, function (subModelId) {
					return state.selectedObjectIdMaps[subModelId].equals(objectIdMaps[subModelId]);
				})) {
					return;
				}
			}
			state.selectedObjectIdMaps = objectIdMaps;
			state.onSelectionChanged.fire();
		}

		/**
		 * @ngdoc function
		 * @name getSelectedObjectIds
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Returns the selected object IDs in an array.
		 * @returns {MultiModelIdSet} The selected object IDs. For any node whose ID
		 *                            is included, all nodes in the node's subtree
		 *                            are considered selected, as well.
		 */
		service.getSelectedObjectIds = function () {
			const result = new modelViewerModelIdSetService.MultiModelIdSet();
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				result[subModelId] = state.selectedObjectIdMaps[subModelId].toArray(true);
			});
			return result;
		};

		service.getSelectedObjectIdCount = function () {
			const selObjectIds = service.getSelectedObjectIds();

			let count = 0;
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				if (angular.isArray(selObjectIds[subModelId])) {
					count += selObjectIds[subModelId].length;
				}
			});
			return count;
		};

		/**
		 * @ngdoc function
		 * @name getExpandedSelectedObjectIdMaps
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Returns a map of all selected object IDs.
		 * @returns {ObjectIdMap} The selected object IDs. This map also includes
		 *                        all nodes whose parent nodes are marked as
		 *                        selected.
		 */
		service.getExpandedSelectedObjectIdMaps = function () {
			function storeSelectedSubtreeObjectIds(node, inheritSelection, selObjectIdMap, destMap) {
				const isSelected = inheritSelection || selObjectIdMap[node.id];
				destMap[node.id] = isSelected;
				node.children.forEach(function (child) {
					storeSelectedSubtreeObjectIds(child, isSelected, selObjectIdMap, destMap);
				});
			}

			let treeInfo;

			function getMapForModel(subModelId) {
				const modelSelObjectIdMap = state.selectedObjectIdMaps[subModelId];
				const modelTreeInfo = treeInfo[subModelId];
				if (modelTreeInfo && modelTreeInfo.tree) {
					const result = new modelViewerObjectIdMapService.ObjectIdMap();
					storeSelectedSubtreeObjectIds(modelTreeInfo.tree, false, modelSelObjectIdMap, result);
					return result;
				} else {
					return modelSelObjectIdMap.clone();
				}
			}

			treeInfo = modelViewerObjectTreeService.getTree();
			const result = new modelViewerModelIdSetService.ObjectIdSet();
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				result[subModelId] = getMapForModel(subModelId);
			});
			return result;
		};

		/**
		 * @ngdoc function
		 * @name getExpandedSelectedObjectIds
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Returns an array of all selected object IDs.
		 * @returns {Array<Number>} The selected object IDs. This map also includes
		 *                          all nodes whose parent nodes are marked as
		 *                          selected.
		 */
		service.getExpandedSelectedObjectIds = function () {
			const expandedSelectedObjectIdMaps = service.getExpandedSelectedObjectIdMap().toArray(true);

			const result = new modelViewerModelIdSetService.ObjectIdSet();
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				result[subModelId] = expandedSelectedObjectIdMaps[subModelId].toArray(true);
			});
			return result;
		};

		/**
		 * @ngdoc function
		 * @name getSelectedMeshIds
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Returns the selected mesh IDs in an array.
		 * @returns {Array<Number>} The selected mesh IDs.
		 */
		service.getSelectedMeshIds = function () {
			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				const result = new modelViewerModelIdSetService.ObjectIdSet();
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					result[subModelId] = treeInfo[subModelId].objectToMeshIds(state.selectedObjectIdMaps[subModelId]).toArray(true);
				});
				return result;
			} else {
				return new modelViewerModelIdSetService.ObjectIdSet();
			}
		};

		service.getSelectedMeshIdCount = function () {
			const selMeshIds = service.getSelectedMeshIds();

			let count = 0;
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				if (angular.isArray(selMeshIds[subModelId])) {
					count += selMeshIds[subModelId].length;
				}
			});
			return count;
		};

		/**
		 * @ngdoc function
		 * @name setSelectedObjectIds
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Sets the set of selected object IDs.
		 * @param {Array<Number>|ObjectIdMap} objectIds The new set of selected
		 *                                              object IDs.
		 */
		service.setSelectedObjectIds = function (objectIds) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				const newSel = new modelViewerModelIdSetService.ObjectIdSet();
				if (objectIds) {
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						newSel[subModelId] = treeInfo[subModelId].sanitizeObjectIds(objectIds[subModelId]);
					});
				}

				updateSelectedObjectIds(newSel);
			}
		};

		/**
		 * @ngdoc function
		 * @name setSelectedMeshIds
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Sets the set of selected mesh IDs.
		 * @param {Array<Number>|ObjectIdMap} meshIds The new set of selected
		 *                                            mesh IDs.
		 */
		service.setSelectedMeshIds = function (meshIds) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				const newSel = new modelViewerModelIdSetService.ObjectIdSet();
				if (meshIds) {
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						const modelTreeInfo = treeInfo[subModelId];

						if (meshIds && meshIds[subModelId]) {
							const objectIds = modelTreeInfo.meshToObjectIds(meshIds[subModelId]);
							newSel[subModelId] = modelTreeInfo.sanitizeObjectIds(objectIds);
						} else {
							newSel[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
						}
					});
				}

				updateSelectedObjectIds(newSel);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name selectAll
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Selects all objects in the loaded model.
		 * @param {modelViewerSelectabilityService.SelectabilityInfo} selectabilityInfo
		 *              A `SelectabilityInfo` object that may restrict the total
		 *              set of selectable meshes.
		 * @returns {Boolean} A value that indicates whether the operation was successful.
		 */
		service.selectAll = function (selectabilityInfo) {
			if (_.isString(selectabilityInfo)) {
				throw new Error('The selectAll function cannot process a string argument anymore.');
			}

			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				let objectIds;
				if (_.isObject(selectabilityInfo)) {
					let meshIds = treeInfo.createMeshIdMap();
					meshIds = selectabilityInfo.reduceToSelectableMeshIds(meshIds);
					objectIds = treeInfo.meshToMinimalObjectIds(meshIds);
				} else {
					objectIds = treeInfo.createObjectIdMap();
				}
				updateSelectedObjectIds(objectIds);
				return true;
			} else {
				return false;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name toggleSelection
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Toggles the selection for all objects in the current model.
		 * @param {modelViewerSelectabilityService.SelectabilityInfo} selectabilityInfo
		 *              A `SelectabilityInfo` object that may restrict the total
		 *              set of selectable meshes.
		 * @returns {Boolean} A value that indicates whether the operation was successful.
		 */
		service.toggleSelection = function (selectabilityInfo) {
			if (_.isString(selectabilityInfo)) {
				throw new Error('The selectAll function cannot process a string argument anymore.');
			}

			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				let objectIds;
				if (_.isObject(selectabilityInfo)) {
					let meshIds = treeInfo.createMeshIdMap(true);
					const selMaps = service.getSelectedMeshIds().normalizeToArrays();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						const modelSelMap = selMaps[subModelId];
						if (modelSelMap) {
							const modelMeshIds = meshIds[subModelId];
							modelSelMap.forEach(function (meshId) {
								modelMeshIds[meshId] = false;
							});
						}
					});
					meshIds = meshIds.normalizeToArrays();
					meshIds = selectabilityInfo.reduceToSelectableMeshIds(meshIds);
					objectIds = treeInfo.meshToMinimalObjectIds(meshIds);
				} else {
					objectIds = treeInfo.invertObjectIds(service.getSelectedObjectIds(), true);
				}
				updateSelectedObjectIds(objectIds);
				return true;
			} else {
				return false;
			}
		};

		/**
		 * @ngdoc function
		 * @name integrateSelection
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Integrates one or more objects into the selection.
		 * @param {Object|Array<Object>} objectIds An array of object IDs, or a single object ID, formatted as an
		 *                                         object with a `subModelId` and an `objectId` property.
		 * @param {Boolean} addToSelection Indicates whether the objects should be added to the current selection
		 *                                 rather than replacing it.
		 * @param {Boolean} expandToParent Indicates whether, in the case that one of the listed objects is already
		 *                                 selected, the parent composite object should be included instead.
		 */
		service.integrateSelection = function (objectIds, addToSelection, expandToParent) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			const actualObjectIds = treeInfo.minimizeObjectIds(objectIds.normalizeToArrays(), true).normalizeToArrays();

			let selectedObjectIdMaps = _.cloneDeep(state.selectedObjectIdMaps);

			// group object IDs to select for each sub-model by selected parent objects
			let bySelectedParent;
			if (addToSelection || expandToParent) {
				bySelectedParent = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					const modelActualObjectIds = actualObjectIds[subModelId];
					const modelSelectedObjectIdMaps = selectedObjectIdMaps[subModelId];
					const modelTreeInfo = treeInfo[subModelId];

					const modelResult = {
						withoutParent: [],
						byParent: {}
					};

					modelActualObjectIds.forEach(function (id) {
						let selectedParentFound = false;

						let obj = modelTreeInfo.byId[id];
						while (obj) {
							if (modelSelectedObjectIdMaps[obj.id]) {
								selectedParentFound = true;

								let children = modelResult.byParent[obj.id];
								if (!children) {
									children = modelResult.byParent[obj.id] = [];
								}
								children.push(id);

								break;
							}
							obj = obj.parent;
						}

						if (!selectedParentFound) {
							modelResult.withoutParent.push(id);
						}
					});

					return modelResult;
				});
			} else {
				bySelectedParent = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					const modelActualObjectIds = actualObjectIds[subModelId];
					return {
						withoutParent: modelActualObjectIds.slice(0),
						byParent: {}
					};
				});
			}

			if (!addToSelection) {
				selectedObjectIdMaps = modelViewerModelSelectionService.forEachSubModel(function () {
					return new modelViewerObjectIdMapService.ObjectIdMap();
				});
			}

			// build new selection map
			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				const modelBySelectedParent = bySelectedParent[subModelId];
				const modelSelectedObjectIdMaps = selectedObjectIdMaps[subModelId];
				const modelTreeInfo = treeInfo[subModelId];

				// these objects have to be added to the selection either way
				modelBySelectedParent.withoutParent.forEach(function (id) {
					modelSelectedObjectIdMaps[id] = addToSelection ? !modelSelectedObjectIdMaps[id] : true;
				});

				// the selection will change differently if a parent of one of the objects is already selected
				Object.keys(modelBySelectedParent.byParent).forEach(function (parentId) {
					parentId = parseInt(parentId);
					const idsByParent = modelBySelectedParent.byParent[parentId];

					if (expandToParent) {
						(function () {
							let compositeParentFound = false;
							modelSelectedObjectIdMaps[parentId] = false;

							let obj = modelTreeInfo.byId[parentId].parent;
							while (obj) {
								if (obj.isComposite) {
									compositeParentFound = true;
									modelSelectedObjectIdMaps[obj.id] = true;
									break;
								}
								obj = obj.parent;
							}

							if (!compositeParentFound) {
								modelSelectedObjectIdMaps.addFromArray(idsByParent, true);
							}
						})();
					} else {
						(function () {
							idsByParent.forEach(function (id) {
								let obj = modelTreeInfo.byId[id];
								let previousId;
								while (obj) {
									if (obj.id !== id) {
										obj.children.forEach(function (child) {
											if (child.id !== previousId) {
												modelSelectedObjectIdMaps[child.id] = true;
											}
										});
									}

									if (modelSelectedObjectIdMaps[obj.id]) {
										modelSelectedObjectIdMaps[obj.id] = false;
										break;
									}
									previousId = obj.id;
									obj = obj.parent;
								}
							});
						})();
					}
				});
			});

			updateSelectedObjectIds(treeInfo.minimizeObjectIds(selectedObjectIdMaps, true));
		};

		/**
		 * @ngdoc function
		 * @name isSelectionEmpty
		 * @function
		 * @methodOf modelViewerCompositeModelObjectSelectionService
		 * @description Checks whether the current selection is empty.
		 * @returns {Boolean} A value that indicates whether the current selection is empty.
		 */
		service.isSelectionEmpty = function () {
			return !state || !state.selectedObjectIdMaps || state.selectedObjectIdMaps.isEmpty();
		};

		return service;
	}
})(angular);
