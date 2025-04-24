/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerObjectTreeService
	 * @function
	 *
	 * @description Manages a representation of the object tree found in the loaded model. The
	 *              representation contains only some superficial data on each object, such as
	 *              its ID and mesh ID.
	 */
	angular.module('model.viewer').factory('modelViewerObjectTreeService', ['_', '$http', '$q',
		'modelViewerObjectIdMapService', '$injector', 'platformCollectionUtilitiesService',
		function (_, $http, $q, modelViewerObjectIdMapService, $injector, platformCollectionUtilitiesService) {
			var service = {};

			var state = {
				loadedTreeInfo: null,
				loadingPromise: null
			};

			// ObjectNode ----------------------------------------------------------------

			/**
			 * @ngdoc function
			 * @name ObjectNode
			 * @function
			 * @methodOf modelViewerObjectTreeService
			 * @description Instantiates a node in the object tree.
			 * @param {Object} dto The node description object as received from the
			 *                     backend.
			 */
			var ObjectNode = function (dto) {
				this.id = globals.isMobileApp ? dto.Id : dto.id;
				this.hasMeshId = globals.isMobileApp ? angular.isNumber(dto.MeshId) : angular.isNumber(dto.meshId);
				this.meshId = this.hasMeshId ? (globals.isMobileApp ? dto.MeshId : dto.meshId) : null;
				this.isComposite = globals.isMobileApp ? !!dto.IsComposite : !!dto.isComposite;
			};

			/**
			 * @ngdoc function
			 * @name findCompositeParent
			 * @function
			 * @methodOf ObjectNode
			 * @description Returns the nearest parent node that is a composite object.
			 * @returns {ObjectNode} The composite parent node, or `null` if no parent
			 *                       parent node of the current node is marked as a
			 *                       composite object.
			 */
			ObjectNode.prototype.findCompositeParent = function () {
				for (var current = this.parent; current; current = current.parent) {
					if (current.isComposite) {
						return current;
					}
				}
				return null;
			};

			/**
			 * @ngdoc function
			 * @name getAllMeshIds
			 * @function
			 * @methodOf ObjectNode
			 * @description Scans the subtree originating from the current node and
			 *              retrieves all mesh IDs from nodes in that subtree.
			 *              Optionally, a set of object IDs may be specified to
			 *              further restrict the search to subtrees originating at
			 *              any of the specified object IDs within the current node's
			 *              subtree.
			 * @param {ObjectIdMap} objectIds Optional. Indicates IDs of root nodes
			 *                                for subtrees to search in.
			 * @returns {Array<Number>} An array of mesh IDs.
			 */
			ObjectNode.prototype.getAllMeshIds = function (objectIds) {
				var result = [];

				var isIncluded = !objectIds || !!objectIds[this.id];

				if (isIncluded && this.hasMeshId) {
					result.push(this.meshId);
				}

				this.children.forEach(function (child) {
					platformCollectionUtilitiesService.appendItems(result, child.getAllMeshIds(isIncluded ? null : objectIds));
				});

				return result;
			};

			/**
			 * @ngdoc function
			 * @name checkMeshIdsIncluded
			 * @function
			 * @methodOf modelViewerObjectTreeService
			 * @description Checks whether all mesh IDs within a given subtree are
			 *              included in a given set of mesh IDs.
			 * @param {ObjectNode} node The root node of the subtree.
			 * @param {Object} meshIdSet The mesh ID set to check for completeness.
			 * @returns {Boolean} The result of the check.
			 */
			function checkMeshIdsIncluded(node, meshIdSet) {
				if (node.hasMeshId) {
					if (!meshIdSet[node.meshId]) {
						return false;
					}
				}

				for (var i = 0; i < node.children.length; i++) {
					if (!checkMeshIdsIncluded(node.children[i], meshIdSet)) {
						return false;
					}
				}

				return true;
			}

			/**
			 * @ngdoc function
			 * @name allMeshIdsIncluded
			 * @function
			 * @methodOf ObjectNode
			 * @description Checks whether all mesh IDs within the subtree rooted
			 *              at the current node are included in a given set of mesh
			 *              IDs.
			 * @param {Array<Number>} meshIds The array of mesh IDs to check for
			 *                                completeness.
			 * @returns {Boolean} The result of the check.
			 */
			ObjectNode.prototype.allMeshIdsIncluded = function (meshIds) {
				var meshIdSet = {};
				meshIds.forEach(function (id) {
					meshIdSet[id] = true;
				});

				return checkMeshIdsIncluded(this, meshIdSet);
			};

			/**
			 * @ngdoc function
			 * @name visitPreorder
			 * @function
			 * @methodOf ObjectNode
			 * @description Visits all nodes in the subtree rooted at the current node
			 *              in pre-order.
			 * @param {Function} visitorFunc A function that will be invoked once for
			 *                               each node. The only argument it receives
			 *                               is the current node.
			 */
			ObjectNode.prototype.visitPreorder = function (visitorFunc) {
				visitorFunc(this);
				this.children.forEach(function (child) {
					child.visitPreorder(visitorFunc);
				});
			};

			/**
			 * @ngdoc function
			 * @name visitPostorder
			 * @function
			 * @methodOf ObjectNode
			 * @description Visits all nodes in the subtree rooted at the current node
			 *              in post-order.
			 * @param {Function} visitorFunc A function that will be invoked once for
			 *                               each node. The only argument it receives
			 *                               is the current node.
			 */
			ObjectNode.prototype.visitPostorder = function (visitorFunc) {
				this.children.forEach(function (child) {
					child.visitPostorder(visitorFunc);
				});
				visitorFunc(this);
			};

			/**
			 * @ngdoc function
			 * @name getAncestorIds
			 * @function
			 * @methodOf ObjectNode
			 * @description Assembles an array with all ancestor node IDs of the
			 *              current node.
			 * @returns {Array<Number>} An array of all node IDs between the current
			 *                          node and the root node (both inclusive),
			 *                          starting with the current node.
			 */
			ObjectNode.prototype.getAncestorIds = function () {
				var result = [];

				var current = this;
				while (current) {
					result.push(current.id);
					current = current.parent;
				}

				return result;
			};

			function subtreeToDebugString(root, firstIndentation, indentation, extraInfoFunc) {
				var debugStr = firstIndentation +
					' #' + root.id +
					(root.hasMeshId ? ' [' + root.meshId + ']' : '') +
					(root.isComposite ? ' c' : '');

				if (extraInfoFunc) {
					debugStr += ' ' + extraInfoFunc(root.id);
				}

				if (root.hasChildren) {
					for (var i = 0; i < root.children.length; i++) {
						var child = root.children[i];
						debugStr += '\n' + subtreeToDebugString(child,
								indentation + ' |-',
								indentation + (i < root.children.length - 1 ? ' | ' : '   '),
								extraInfoFunc);
					}
				}

				return debugStr;
			}

			/**
			 * @ngdoc function
			 * @name toDebugString
			 * @function
			 * @methodOf ObjectNode
			 * @description Generates a string representation of the subtree for debugging purposes.
			 * @param {Function} extraInfoFunc An optional function that is called once for each object, with the object
			 *                                 ID as an argument. It is supposed to return a string that will be shown
			 *                                 next to the object in the string representation of the hierarchy.
			 * @returns {String} The string representation.
			 */
			ObjectNode.prototype.toDebugString = function (extraInfoFunc) {
				return subtreeToDebugString(this, '', '', extraInfoFunc);
			};

			// end of ObjectNode ----------------------------------------------------------------

			/**
			 * @ngdoc function
			 * @name loadTree
			 * @function
			 * @methodOf modelViewerObjectTreeService
			 * @description Loads the tree info for a given model ID into the service.
			 * @param {Number} modelId The ID of the model for which to load the tree.
			 * @returns {Promise<Object>} A promise that gets resolved once the tree
			 *                            info has been loaded. The promise will return
			 *                            the tree info object, or `null` if `modelId`
			 *                            was falsy.
			 */
			service.loadTree = function (modelId) {
				state.loadedTreeInfo = null;
				if (modelId) {
					state.loadingPromise = $http.get(globals.webApiBaseUrl + (globals.isMobileApp ? 'model/publicapi/object/1.0/trees' : 'model/main/object/trees') + '?modelId=' + modelId).then(function (response) {
						var result = {};
						_.sortBy(response.data, function (sm) {
							return globals.isMobileApp ? sm.SubModelId : sm.subModelId;
						}).forEach(function (sm, index) {
							var treeInfo = processRawTree(globals.isMobileApp ? sm.Tree : sm.tree);
							treeInfo.modelId = globals.isMobileApp ? sm.SubModelId : sm.subModelId;
							treeInfo.subModelId = index + 1;

							result[treeInfo.subModelId] = treeInfo;
						});
						addTreeInfoMapFunctions(result);
						return result;
					}).then(function (treeInfo) {
						state.loadedTreeInfo = treeInfo;
						return treeInfo;
					});
					return state.loadingPromise;
				} else {
					return $q.when(null);
				}
			};

			/**
			 * @ngdoc function
			 * @name processRawTreeNode
			 * @function
			 * @methodOf modelViewerObjectTreeService
			 * @description Creates an `ObjectNode` based upon a tree node DTO received
			 *              from the backend.
			 * @param {Object} node The object tree node DTO.
			 * @param {ObjectNode} parentNode The `ObjectNode` instance representing
			 *                                the parent of the newly created object.
			 * @param {Object} info The tree info object.
			 * @returns {ObjectNode} The newly created node object.
			 */
			function processRawTreeNode(node, parentNode, info) {
				var objNode = new ObjectNode(node);
				objNode.children = angular.isArray(globals.isMobileApp ? node.Children : node.children) ? _.map(globals.isMobileApp ? node.Children : node.children, function (child) {
					return processRawTreeNode(child, objNode, info);
				}) : [];
				objNode.hasChildren = objNode.children.length > 0;
				objNode.parent = (parentNode && (parentNode.id > 0)) ? parentNode : null;

				if (objNode.id > 0) {
					info.byId[objNode.id] = objNode;
					info.objectCount++;
					if (objNode.hasMeshId) {
						info.byMeshId[objNode.meshId] = objNode;
						info.meshCount++;
					}
				}

				return objNode;
			}

			/**
			 * @ngdoc function
			 * @name processRawTree
			 * @function
			 * @methodOf modelViewerObjectTreeService
			 * @description Creates a tree info object based upon a tree of object
			 *              DTOs received from the backend.
			 * @param {Object} root The root of the DTO tree.
			 * @returns {Object} The tree info object.
			 */
			function processRawTree(root) {
				var treeInfo = {
					byId: {},
					byMeshId: {},
					objectCount: 0,
					meshCount: 0
				};

				var processedTree = root ? processRawTreeNode(root, null, treeInfo) : null;
				treeInfo.isObjectHierarchy = !!processedTree && (processedTree.id > 0);
				if (treeInfo.isObjectHierarchy) {
					treeInfo.tree = processedTree;
				}

				treeInfo.createObjectIdMap = function (defaultValue) {
					return new modelViewerObjectIdMapService.ObjectIdMap(treeInfo.allObjectIds(), defaultValue);
				};
				treeInfo.createMeshIdMap = function (defaultValue) {
					return new modelViewerObjectIdMapService.ObjectIdMap(treeInfo.allMeshIds(), defaultValue);
				};

				treeInfo.allObjectIds = function () {
					return _.map(Object.keys(treeInfo.byId), function (id) {
						return parseInt(id);
					});
				};
				treeInfo.allMeshIds = function () {
					return _.map(Object.keys(treeInfo.byMeshId), function (meshId) {
						return parseInt(meshId);
					});
				};

				treeInfo.minimizeObjectIds = function (objectIds, onlyComposite) {
					var result = new modelViewerObjectIdMapService.ObjectIdMap();

					var objectIdMap = angular.isArray(objectIds) ? new modelViewerObjectIdMapService.ObjectIdMap(objectIds, true) : objectIds;
					var tentativeObjectIdMap = new modelViewerObjectIdMapService.ObjectIdMap();

					if (treeInfo.tree) {
						treeInfo.tree.visitPostorder(function (node) {
							var nodeIsExplicitlySelected = objectIdMap[node.id];
							if (nodeIsExplicitlySelected || (node.hasChildren && _.every(node.children, function (child) {
									return result[child.id] || tentativeObjectIdMap[child.id];
								}))) {
								if (!onlyComposite || node.isComposite || node.hasMeshId || nodeIsExplicitlySelected) {
									result[node.id] = true;
								} else {
									tentativeObjectIdMap[node.id] = true;
								}
							}
						});

						var processNextNode = function processNextNode(node, inSelection) {
							var continueInSelection = false;
							if (inSelection) {
								result[node.id] = false;
								continueInSelection = true;
							} else {
								if (result[node.id]) {
									continueInSelection = true;
								}
							}

							if (node.hasChildren) {
								node.children.forEach(function (child) {
									processNextNode(child, continueInSelection);
								});
							}
						};
						processNextNode(treeInfo.tree, false);
					} else {
						result = objectIdMap.clone();
					}

					return result;
				};

				treeInfo.meshToObjectIds = function (meshIds) {
					if (angular.isArray(meshIds)) {
						return _.map(meshIds, function (meshId) {
							return treeInfo.byMeshId[meshId].id;
						});
					} else {
						return meshIds.mapIds(function (meshId) {
							return treeInfo.byMeshId[meshId].id;
						});
					}
				};

				treeInfo.meshToMinimalObjectIds = function (meshIds, onlyComposite) {
					var objectIds = treeInfo.meshToObjectIds(meshIds);
					var minimalObjectIds = treeInfo.minimizeObjectIds(objectIds, onlyComposite);
					if (angular.isArray(objectIds)) {
						return minimalObjectIds.toArray(function (v) {
							return !!v;
						});
					} else {
						return minimalObjectIds;
					}
				};

				treeInfo.objectToMeshIds = function (objectIds) {
					if (treeInfo.tree) {
						if (angular.isArray(objectIds)) {
							return treeInfo.tree.getAllMeshIds(new modelViewerObjectIdMapService.ObjectIdMap(objectIds, true));
						} else {
							return new modelViewerObjectIdMapService.ObjectIdMap(treeInfo.tree.getAllMeshIds(objectIds), true);
						}
					} else {
						if (angular.isArray(objectIds)) {
							return _.map(_.filter(_.map(objectIds, function (id) {
								return treeInfo.byId[id];
							}), function (node) {
								return node && node.meshId;
							}), function (node) {
								return node.meshId;
							});
						} else {
							var result = new modelViewerObjectIdMapService.ObjectIdMap();
							objectIds.toArray(function (v) {
								return !!v;
							}).forEach(function (id) {
								var node = treeInfo.byId[id];
								if (node && node.meshId) {
									result[node.meshId] = true;
								}
							});
							return result;
						}
					}
				};

				treeInfo.sanitizeObjectIds = function (objectIds) {
					if (angular.isArray(objectIds)) {
						return _.filter(objectIds, function (id) {
							return treeInfo.byId[id];
						});
					} else if (angular.isObject(objectIds)) {
						return (function () {
							var result = new modelViewerObjectIdMapService.ObjectIdMap();
							objectIds.toArray().forEach(function (id) {
								if (treeInfo.byId[id]) {
									result[id] = objectIds[id];
								}
							});
							return result;
						})();
					} else {
						return null;
					}
				};

				treeInfo.sanitizeMeshIds = function (meshIds) {
					if (angular.isArray(meshIds)) {
						return _.filter(meshIds, function (id) {
							return treeInfo.byMeshId[id];
						});
					} else {
						return (function () {
							var result = new modelViewerObjectIdMapService.ObjectIdMap();
							meshIds.forEach(function (id) {
								if (treeInfo.byMeshId[id]) {
									result[id] = meshIds[id];
								}
							});
							return result;
						})();
					}
				};

				treeInfo.invertObjectIds = function (objectIds, hierarchically) {
					if (hierarchically) {
						return (function invertHierarchicalIds () {
							var result = new modelViewerObjectIdMapService.ObjectIdMap();
							treeInfo.allObjectIds().forEach(function (objectId) {
								result[objectId] = true;
							});

							var objectIdArray = angular.isArray(objectIds) ? objectIds : objectIds.toArray();
							objectIdArray.forEach(function (objectId) {
								var obj = treeInfo.byId[objectId];
								for (var current = obj; current; current = current.parent) {
									if (!result[current.id]) {
										break;
									}
									result[current.id] = false;
								}
								if (obj.hasChildren) {
									var nextChildren = _.clone(obj.children);
									while (nextChildren.length > 0) {
										var child = nextChildren.shift();
										if (result[child.id]) {
											result[child.id] = false;
											if (child.hasChildren) {
												platformCollectionUtilitiesService.appendItems(nextChildren, child.children);
											}
										}
									}
								}
							});

							return result;
						})();
					} else {
						return (function invertFlatIds () {
							var objectIdMap = angular.isArray(objectIds) ? new modelViewerObjectIdMapService.ObjectIdMap(objectIds, true) : objectIds;
							var result = new modelViewerObjectIdMapService.ObjectIdMap();
							treeInfo.allObjectIds().forEach(function (objectId) {
								if (!objectIdMap[objectId]) {
									result[objectId] = true;
								}
							});
							if (angular.isArray(objectIds)) {
								return result.toArray(function (v) {
									return !!v;
								});
							} else {
								return result;
							}
						})();
					}
				};

				treeInfo.invertMeshIds = function (meshIds) {
					var meshIdMap = angular.isArray(meshIds) ? new modelViewerObjectIdMapService.ObjectIdMap(meshIds, true) : meshIds;
					var result = new modelViewerObjectIdMapService.ObjectIdMap();
					treeInfo.allMeshIds().forEach(function (objectId) {
						if (!meshIdMap[objectId]) {
							result[objectId] = true;
						}
					});
					if (angular.isArray(meshIds)) {
						return result.toArray(function (v) {
							return !!v;
						});
					} else {
						return result;
					}
				};

				treeInfo.selectObjects = function (settings) {
					var actualSettings = _.assign({
						selectWhere: function () {
							return true;
						},
						processChildrenWhere: function () {
							return true;
						},
						selectKey: function (node) {
							return node.id;
						},
						selectValue: function () {
							return true;
						},
						getInitialResult: function () {
							return new modelViewerObjectIdMapService.ObjectIdMap();
						},
						appendToResult: function (currentResult, node) {
							currentResult[this.selectKey(node)] = this.selectValue(node);
							return currentResult;
						}
					}, settings || {});
					if (actualSettings.subtrees) {
						actualSettings.subtrees = angular.isArray(actualSettings.subtrees) ? actualSettings.subtrees : actualSettings.subtrees.toArray();
					} else {
						actualSettings.subtrees = treeInfo.tree ? [treeInfo.tree.id] : treeInfo.allObjectIds();
					}

					var result = actualSettings.getInitialResult();

					actualSettings.subtrees.forEach(function (id) {
						var rootNode = treeInfo.byId[id];
						if (rootNode) {
							var nextNodes = [rootNode];
							while (nextNodes.length > 0) {
								var currentNode = nextNodes.shift();
								if (currentNode) {
									if (actualSettings.selectWhere(currentNode)) {
										result = actualSettings.appendToResult(result, currentNode);
									}
									if (currentNode.hasChildren && actualSettings.processChildrenWhere(currentNode)) {
										platformCollectionUtilitiesService.appendItems(nextNodes, currentNode.children);
									}
								}
							}
						}
					});

					return result;
				};

				return treeInfo;
			}

			function addTreeInfoMapFunctions(treeInfo) {
				var modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
				var modelViewerModelIdSetService = $injector.get('modelViewerModelIdSetService');

				treeInfo.createObjectIdMap = function (defaultValue) {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						result[subModelId] = treeInfo[subModelId].createObjectIdMap(defaultValue);
					});
					return result;
				};
				treeInfo.createMeshIdMap = function (defaultValue) {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						result[subModelId] = treeInfo[subModelId].createMeshIdMap(defaultValue);
					});
					return result;
				};

				treeInfo.allObjectIds = function () {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						result[subModelId] = treeInfo[subModelId].allObjectIds();
					});
					return result;
				};
				treeInfo.allMeshIds = function () {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						result[subModelId] = treeInfo[subModelId].allMeshIds();
					});
					return result;
				};

				treeInfo.minimizeObjectIds = function (objectIds, onlyComposite) {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						if (objectIds[subModelId]) {
							result[subModelId] = treeInfo[subModelId].minimizeObjectIds(objectIds[subModelId], onlyComposite);
						}
					});
					return result;
				};

				treeInfo.meshToObjectIds = function (meshIds) {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						if (meshIds[subModelId]) {
							result[subModelId] = treeInfo[subModelId].meshToObjectIds(meshIds[subModelId]);
						}
					});
					return result;
				};

				treeInfo.meshToMinimalObjectIds = function (meshIds, onlyComposite) {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						if (meshIds[subModelId]) {
							result[subModelId] = treeInfo[subModelId].meshToMinimalObjectIds(meshIds[subModelId], onlyComposite);
						}
					});
					return result;
				};

				treeInfo.objectToMeshIds = function (objectIds) {
					var result = new modelViewerModelIdSetService.ObjectIdSet();
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						if (objectIds[subModelId]) {
							result[subModelId] = treeInfo[subModelId].objectToMeshIds(objectIds[subModelId]);
						}
					});
					return result;
				};

				treeInfo.sanitizeObjectIds = function (objectIds) {
					return modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelObjectIds = objectIds[subModelId];
						if (modelObjectIds) {
							return treeInfo[subModelId].sanitizeObjectIds(objectIds);
						}
					});
				};

				treeInfo.sanitizeMeshIds = function (meshIds) {
					return modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelMeshIds = meshIds[subModelId];
						if (modelMeshIds) {
							return treeInfo[subModelId].sanitizeMeshIds(meshIds);
						}
					});
				};

				treeInfo.invertObjectIds = function (objectIds, hierarchically) {
					return modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelObjectIds = objectIds[subModelId];
						if (modelObjectIds) {
							return treeInfo[subModelId].invertObjectIds(modelObjectIds, hierarchically);
						} else {
							return treeInfo[subModelId].allObjectIds();
						}
					});
				};

				treeInfo.invertMeshIds = function (meshIds) {
					return modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelMeshIds = meshIds[subModelId];
						if (modelMeshIds) {
							return treeInfo[subModelId].invertMeshIds(modelMeshIds);
						} else {
							return treeInfo[subModelId].allMeshIds();
						}
					});
				};

				treeInfo.selectObjects = function (settings) {
					var actualSettings = _.assign({
						getInitialMultiModelResult: function () {
							return new modelViewerModelIdSetService.ObjectIdSet();
						},
						appendToMultiModelResult: function (currentResult, subModelId, modelResult) {
							currentResult[subModelId] = modelResult;
							return currentResult;
						}
					}, settings || {});

					var result = actualSettings.getInitialMultiModelResult();

					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelSettings = _.clone(actualSettings || {});
						if (actualSettings.subtrees) {
							modelSettings.subtrees = actualSettings.subtrees[subModelId] || [];
						} else {
							modelSettings.subtrees = null;
						}
						var modelResult = treeInfo[subModelId].selectObjects(modelSettings);
						result = actualSettings.appendToMultiModelResult(result, subModelId, modelResult);
					});

					return result;
				};


				if (globals.isMobileApp) {
					var doLoadObjectDescriptions = function (ids, objectFromModelTreeInfoFunc, apiName, argName) {
						var actualIds = ids.normalizeToArrays();

						var requiredIds = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelRequiredIds = new modelViewerObjectIdMapService.ObjectIdMap();

							var modelElementIds = actualIds[subModelId];
							if (modelElementIds) {
								var modelTreeInfo = treeInfo[subModelId];

								modelElementIds.forEach(function (elementId) {
									var obj = objectFromModelTreeInfoFunc(modelTreeInfo, elementId);
									if (obj) {
										if (_.isUndefined(obj.description)) {
											modelRequiredIds[elementId] = true;
										}
									}
								});
							}

							return modelRequiredIds;
						});

						if (requiredIds.isEmpty()) {
							return $q.resolve();
						} else {
							return $http.get(globals.webApiBaseUrl + 'model/publicapi/object/1.0/' + apiName + '?' + argName + '=' + requiredIds.useGlobalModelIds().toCompressedString()).then(function (response) {
								if (_.isArray(response.data)) {
									var selModel = modelViewerModelSelectionService.getSelectedModel();
									response.data.forEach(function (item) {
										var subModelId = selModel.globalModelIdToSubModelId(item.ModelId);
										var modelTreeInfo = treeInfo[subModelId];
										if (modelTreeInfo) {
											var obj = objectFromModelTreeInfoFunc(modelTreeInfo, item.Id);
											if (obj) {
												obj.description = item.Text;
											}
										}
									});
								} else {
									return $q.reject();
								}
							});
						}
					};

					treeInfo.loadObjectDescriptions = function (objectIds) {
						return doLoadObjectDescriptions(objectIds, function (modelTreeInfo, elementId) {
							return modelTreeInfo.byId[elementId];
						}, 'objectdesc', 'objectIds');
					};

					treeInfo.loadObjectDescriptionsByMesh = function (meshIds) {
						return doLoadObjectDescriptions(meshIds, function (modelTreeInfo, elementId) {
							return modelTreeInfo.byMeshId[elementId];
						}, 'meshdesc', 'meshIds');
					};
				}
			}

			/**
			 * @ngdoc function
			 * @name getTree
			 * @function
			 * @methodOf modelViewerObjectTreeService
			 * @description Retrieves the currently loaded tree info.
			 * @returns {Object} The last tree info object loaded with `loadTree`,
			 *                   or `null` if no truthy model ID was specified upon
			 *                   the last invocation of `loadTree`.
			 */
			service.getTree = function () {
				return state.loadedTreeInfo;
			};

			/**
			* @ngdoc function
			* @name retrieveObjectsByMode
			* @constructor
			* @methodOf modelViewerObjectTreeService
			* @description Retrieve Objects  based  on the Mode.
			* @param {Objects} list of selected objects to retrieve from.
			* @param {settings} contains the mode of retrieval.
			*/
			service.retrieveObjectsByMode = function(objects, settings) {

				var modelViewerViewerRegistryService = $injector.get('modelViewerViewerRegistryService');
				var modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
				var modelViewerSelectionWizardService = $injector.get('modelViewerSelectionWizardService');
				var treeInfo = this.getTree();

				function getLeaves(objects, filter) {
					if (objects.objectIds) {
						return {
							objectIds: modelViewerModelSelectionService.forEachSubModel(function (subModelId) {

								var modelObjectIds = objects.objectIds[subModelId];
								if (modelObjectIds) {
									var modelTreeInfo = treeInfo[subModelId];

									var result = new modelViewerObjectIdMapService.ObjectIdMap();

									if (_.isArray(modelObjectIds)) {
										modelObjectIds.forEach(function (objectId) {
											findLeaves(objectId);
										});
									} else if (_.isObject(modelObjectIds)) {
										Object.keys(modelObjectIds).forEach(function (objectId) {
											objectId = parseInt(objectId);
											if (modelObjectIds[objectId]) {
												findLeaves(parseInt(objectId));
											}
										});
									}

									return result;
								}

								function findLeaves(subTreeRootId) {
									var subTreeRoot = modelTreeInfo.byId[subTreeRootId];
									if (subTreeRoot) {
										subTreeRoot.visitPreorder(function (obj) {
											if (!obj.hasChildren) {
												if (!_.isFunction(filter) || filter(obj)) {
													result[obj.id] = true;
												}
											}
										});
									}
								}


							})
						};
					} else {
						return objects;
					}
				}

				if (!_.isNil(settings.selMask) && (settings.selMask !== 'none')) {
					objects = (function applySelectionMask() {
						var viewerInfo = _.find(modelViewerViewerRegistryService.getViewers(), function (vi) {
							return vi.id === settings.selMask;
						});
						if (viewerInfo) {
							if (objects.meshIds) {
								return {
									meshIds: viewerInfo.getSelectabilityInfo().reduceToSelectableMeshIds(objects.meshIds)
								};
							} else {
								return {
									meshIds: viewerInfo.getSelectabilityInfo().reduceToSelectableMeshIds(treeInfo.objectToMeshIds(objects.objectIds))
								};
							}
						}
						return objects;
					})();
				}

				switch (settings.treePart) {
					case 'mincl':
						return (function useMinimalCompositeObjectsAndLeaves() {
							var leaves = getLeaves(objects);
							if (leaves.objectIds) {
								return {
									objectIds: treeInfo.minimizeObjectIds(leaves.objectIds, true)
								};
							} else {
								return {
									objectIds: treeInfo.meshToMinimalObjectIds(leaves.meshIds, true)
								};
							}
						})();
					case 'minc':
						return (function useMinimalCompositeObjects() {
							var resultObjectIds;

							var leaves = getLeaves(objects);
							if (leaves.objectIds) {
								resultObjectIds = treeInfo.minimizeObjectIds(leaves.objectIds, true);
							} else {
								resultObjectIds = treeInfo.meshToMinimalObjectIds(leaves.meshIds, true);
							}

							return {
								objectIds: modelViewerModelSelectionService.forEachSubModel(function (subModelId) {

									var modelResultObjectIds = resultObjectIds[subModelId];
									var modelTreeInfo = treeInfo[subModelId];

									var onlyCompositeObjectIds = new modelViewerObjectIdMapService.ObjectIdMap();

									if (_.isArray(modelResultObjectIds)) {
										modelResultObjectIds.forEach(addObject);
									} else if (_.isObject(modelResultObjectIds)) {
										Object.keys(modelResultObjectIds).forEach(function (objectId) {
											objectId = parseInt(objectId);
											if (modelResultObjectIds[objectId]) {
												addObject(objectId);
											}
										});
									}

									function addObject(objectId) {
										var obj = modelTreeInfo.byId[objectId];
										if (obj && obj.isComposite) {
											onlyCompositeObjectIds[obj.id] = true;
										}
									}

									return onlyCompositeObjectIds;
								})
							};
						})();
					case 'min':
						return (function useMinimalObjects() {
							if (objects.objectIds) {
								return {
									objectIds: treeInfo.minimizeObjectIds(objects.objectIds)
								};
							} else {
								return {
									objectIds: treeInfo.meshToMinimalObjectIds(objects.meshIds)
								};
							}
						})();
					case 'l':
						return getLeaves(objects);
					case 'm':
						return getLeaves(objects, function (obj) {
							return obj.hasMeshId;
						});
					case 'a':
						return (function useAllObjects() {
							var minimalSelection = modelViewerSelectionWizardService.getMinimalObjectIds(treeInfo, objects);

							return {
								objectIds: modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
									var modelResult = new modelViewerObjectIdMapService.ObjectIdMap();

									var modelMinimalSelection = minimalSelection[subModelId];
									var modelTreeInfo = treeInfo[subModelId];
									if (_.isArray(modelMinimalSelection)) {
										modelMinimalSelection.forEach(function (objectId) {
											addAllObjectIds(objectId);
										});
									} else if (_.isObject(modelMinimalSelection)) {
										Object.keys(modelMinimalSelection).forEach(function (objectId) {
											objectId = parseInt(objectId);
											if (modelMinimalSelection[objectId]) {
												addAllObjectIds(objectId);
											}
										});
									}

									function addAllObjectIds(rootId) {
										var subTreeRoot = modelTreeInfo.byId[rootId];
										if (subTreeRoot) {
											subTreeRoot.visitPreorder(function (obj) {
												modelResult[obj.id] = true;
											});
										}
									}


									return modelResult;
								})
							};
						})();
					default:
						throw new Error('Invalid tree part setting: ' + settings.treePart);
				}


			};

			return service;
		}]);
})(angular);
