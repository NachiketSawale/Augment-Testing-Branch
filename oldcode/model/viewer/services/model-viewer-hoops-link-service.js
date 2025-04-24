/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsLinkService
	 * @function
	 *
	 * @description Creates wrappers for the Hoops 3D Viewer that can be passed to the viewer registry service. If
	 *              another viewer needs to be integrated, an equivalent service should be created for that viewer type.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsLinkService',
		modelViewerHoopsLinkService);

	modelViewerHoopsLinkService.$inject = ['_', '$q', 'Communicator',
		'modelViewerModelSelectionService', 'platformCollectionUtilitiesService',
		'modelViewerHoopsUtilitiesService', 'modelViewerObjectIdMapService', '$timeout',
		'modelViewerObjectTreeService', 'modelViewerCompositeModelObjectSelectionService',
		'PlatformMessenger', 'modelViewerModelIdSetService', 'platformPromiseUtilitiesService',
		'$injector'];

	function modelViewerHoopsLinkService(_, $q, Communicator,
		modelViewerModelSelectionService, platformCollectionUtilitiesService,
		modelViewerHoopsUtilitiesService, modelViewerObjectIdMapService, $timeout,
		modelViewerObjectTreeService, modelViewerCompositeModelObjectSelectionService,
		PlatformMessenger, modelViewerModelIdSetService, platformPromiseUtilitiesService,
		$injector) {

		const service = {};

		function withCuttingManager(viewerContainer, func) {
			const viewer = viewerContainer.viewer();

			let resultPromise;

			let isOwnCuttingManager = false;
			if (!viewer.rib$cuttingGeometry || !viewer.rib$cuttingGeometry.manager) {
				resultPromise = $injector.get('modelViewerHoopsCuttingService').createManager(viewer, viewerContainer.viewerSettings).getMeshReadyPromise();
				isOwnCuttingManager = true;
			} else {
				resultPromise = $q.when();
			}

			const mgr = viewer.rib$cuttingGeometry.manager;

			return resultPromise.then(() => $q.when(func(mgr))).then(function (result) {
				if (isOwnCuttingManager) {
					mgr.destroy(); // hack will be changed
				}

				return result;
			});
		}

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name createActions
		 * @function
		 * @methodOf modelViewerHoopsLinkService
		 * @description Creates an actions object that can be passed to a `ViewerInfo` object.
		 * @param {Object} viewerContainer An object that returns a {@link Communicator.WebViewer} from its `viewer`
		 *                                 function, and a viewer settings object in its `viewerSettings` property.
		 *                                 These properties need not be assigned at the time of invoking this
		 *                                 method. They are only expected to be non-null once the methods of the
		 *                                 returned object are invoked. Furthermore, the object must have a
		 *                                 `getActiveOds()` method for retrieving the active object display
		 *                                 settings, and `setTemporaryManipulationOperator()` and
		 *                                 `unsetTemporaryManipulationOperator()` methods.
		 * @returns {Object} The actions object.
		 */
		service.createActions = function (viewerContainer) {
			return {
				getCuttingActive() {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return null;
					}
					const viewer = viewerContainer.viewer();
					if (!viewer.rib$cuttingGeometry) {
						return false;
					}

					const mgr = viewer.rib$cuttingGeometry.manager;
					return mgr.isCuttingActive();
				},
				setCuttingActive: function () {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return null;
					}
					return withCuttingManager(viewerContainer, mgr => mgr.activate());
				},
				setCuttingInactive: function () {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return null;
					}
					return withCuttingManager(viewerContainer, mgr => mgr.deactivate());
				},
				setCuttingPlane: function (cuttingPlanes) {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return;
					}

					return withCuttingManager(viewerContainer, function (mgr) {
						return $q.when(mgr.getMeshReadyPromise()).then(function () {
							if (cuttingPlanes.length === 3) {
								for (let i = 0; i < cuttingPlanes.length; i++) {
									if (cuttingPlanes[i].NormalX === 0 && cuttingPlanes[i].NormalY === 0) {
										const newPos = [cuttingPlanes[i].PosX, cuttingPlanes[i].PosY, cuttingPlanes[i].PosZ,
											cuttingPlanes[i].NormalX, cuttingPlanes[i].NormalY, cuttingPlanes[i].NormalZ];
										mgr.movePlaneTo('z', newPos);
									}
									if (cuttingPlanes[i].NormalZ === 0) {
										if (cuttingPlanes[i] === cuttingPlanes[0]) {
											const xPos = [cuttingPlanes[i].PosX, cuttingPlanes[i].PosY, cuttingPlanes[i].PosZ,
												cuttingPlanes[i].NormalX, cuttingPlanes[i].NormalY, cuttingPlanes[i].NormalZ];
											mgr.rotatePlaneAroundZ('x', xPos);
											mgr.movePlaneTo('x', xPos);
										} else {
											const yPos = [cuttingPlanes[i].PosX, cuttingPlanes[i].PosY, cuttingPlanes[i].PosZ,
												cuttingPlanes[i].NormalX, cuttingPlanes[i].NormalY, cuttingPlanes[i].NormalZ];
											mgr.rotatePlaneAroundZ('y', yPos);
											mgr.movePlaneTo('y', yPos);
										}
									}
								}
							}
						});
					});
				},
				getCuttingPlane: function () {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return null;
					}
					const viewer = viewerContainer.viewer();
					const result = [];

					for (let idx = 0; idx <= viewer.cuttingManager.getCuttingSectionCount() - 1; idx++) {
						const cuttingSec = viewer.cuttingManager.getCuttingSection(idx);
						for (let i = 0; i < cuttingSec.getCount(); i++) {
							const cuttingPlane = cuttingSec.getPlane(i);

							const supportVector = cuttingPlane.normal.copy().normalize().scale(-cuttingPlane.d);
							result.push({
								PosX: supportVector.x,
								PosY: supportVector.y,
								PosZ: supportVector.z,
								NormalX: cuttingPlane.normal.x,
								NormalY: cuttingPlane.normal.y,
								NormalZ: cuttingPlane.normal.z,
							});
						}
					}
					return result;
				},
				showCamPos: function (camPos) {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return;
					}

					const viewer = viewerContainer.viewer();

					const view = viewer.view;
					const camera = view.getCamera();

					const origViewDist = Communicator.Point3.subtract(camera.getTarget(), camera.getPosition()).length();

					const newPos = new Communicator.Point3(camPos.pos.x, camPos.pos.y, camPos.pos.z);
					camera.setPosition(newPos);
					const newViewDir = Communicator.Point3.subtract(new Communicator.Point3(camPos.trg.x, camPos.trg.y, camPos.trg.z), newPos).normalize().scale(origViewDist);
					camera.setTarget(Communicator.Point3.add(newPos, newViewDir));
					camera.setUp(new Communicator.Point3(0, 0, 1));

					view.setCamera(camera, viewerContainer.viewerSettings.transitions ? 500 : 0);
				},
				getCurrentCamPos: function () {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return null;
					}

					const camera = viewerContainer.viewer().view.getCamera();
					const isOrthographic = camera.getProjection() === Communicator.Projection.Orthographic;
					const pos = camera.getPosition();
					const direction = camera.getTarget().subtract(pos).normalize();
					const up = camera.getUp();

					return {
						PosX: pos.x,
						PosY: pos.y,
						PosZ: pos.z,
						DirX: direction.x,
						DirY: direction.y,
						DirZ: direction.z,
						UpX: up.x,
						UpY: up.y,
						UpZ: up.z,
						IsOrthographic: isOrthographic
					};
				},
				setSelection: function (selectedObjectIds) {
					if (!viewerContainer.viewer || !viewerContainer.isSceneReady) {
						return;
					}

					const viewer = viewerContainer.viewer();

					const selMgr = viewer.selectionManager;
					selMgr.clear();

					const nodeIds = service.objectToViewerIds(viewer, selectedObjectIds);
					if (nodeIds.length > 0) {
						selMgr.add(_.map(nodeIds, function (nodeId) {
							return Communicator.Selection.SelectionItem.create(nodeId);
						}));
					}
				},
				setTemporaryManipulationOperator: function (operatorId, activationData) {
					viewerContainer.setTemporaryManipulationOperator(operatorId, activationData);
				},
				unsetTemporaryManipulationOperator: function () {
					viewerContainer.unsetTemporaryManipulationOperator();
				},
				reload: function () {
					viewerContainer.refreshViewerPage();
				},
				initialize: function () {
					const modelViewerHoopsFilterEngineService = $injector.get('modelViewerHoopsFilterEngineService');
					return new modelViewerHoopsFilterEngineService.FilterEngine(viewerContainer.viewer());
				},
				getSelectabilityInfo: function () {
					const modelViewerSelectabilityService = $injector.get('modelViewerSelectabilityService');
					return modelViewerSelectabilityService.getSelectabilityInfo(viewerContainer.viewer());
				},
				getFilterEngine: function () {
					const modelViewerHoopsFilterEngineService = $injector.get('modelViewerHoopsFilterEngineService');
					if (viewerContainer.viewer) {
						return modelViewerHoopsFilterEngineService.getFilterEngine(viewerContainer.viewer());
					} else {
						return null;
					}
				},
				takeSnapshot: function (config) {
					const effectiveConfig = _.assign({}, _.isObject(config) ? config : {});

					if (!_.isInteger(effectiveConfig.width)) {
						if (!_.isInteger(effectiveConfig.height)) {
							effectiveConfig.width = 1024;
							effectiveConfig.height = 768;
						} else {
							effectiveConfig.width = effectiveConfig.height / 3 * 4;
						}
					} else {
						if (!_.isInteger(effectiveConfig.height)) {
							effectiveConfig.height = effectiveConfig.width / 4 * 3;
						}
					}

					const cfg = new Communicator.SnapshotConfig(effectiveConfig.width, effectiveConfig.height);
					if (viewerContainer.viewer) {
						return viewerContainer.viewer().takeSnapshot(cfg).then(function (img) {
							return img.src;
						});
					}
					return $q.reject('No viewer available.');
				}
			};
		};

		service.getSubModelsMapProperty = function () {
			return 'rib$models';
		};

		service.inclusionIdToSubModelId = function (viewer, inclusionId) {
			const result = viewer[service.getSubModelsMapProperty()].inclusionToSubModel[inclusionId];
			if (angular.isNumber(result)) {
				return result;
			} else {
				return null;
			}
		};

		service.subModelIdToInclusionId = function (viewer, subModelId) {
			const result = viewer[service.getSubModelsMapProperty()].subModelToInclusion[subModelId];
			if (angular.isNumber(result)) {
				return result;
			} else {
				throw new Error('No inclusion ID available for sub-model ' + subModelId + '.');
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name viewerToMeshId
		 * @function
		 * @methodOf modelViewerHoopsLinkService
		 * @description Retrieves the mesh ID of a model object (as found in the database) for a given viewer ID
		 *              (as used by the HOOPS viewer).
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Number} viewerId The viewer ID as used by the viewer.
		 * @returns {Number} The mesh ID as found in the database, or `null` if no mesh ID could be found.
		 */
		service.viewerToMeshId = function (viewer, viewerId) {
			const key = viewer.model.getSCInstanceKey(viewerId);
			return {
				subModelId: service.inclusionIdToSubModelId(viewer, key[0]),
				meshId: key[1]
			};
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name meshToViewerId
		 * @function
		 * @methodOf modelViewerHoopsLinkService
		 * @description Retrieves the viewer ID of a model object (as used by the HOOPS viewer) for a given mesh ID
		 *              (as found in the database).
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Number} idInfo The mesh ID as found in the database.
		 * @returns {Number} The viewer ID as used by the viewer.
		 */
		service.meshToViewerId = function (viewer, idInfo) {
			return viewer.model.getNodeIDFromSCInstanceKey(service.subModelIdToInclusionId(viewer, idInfo.subModelId), idInfo.meshId);
		};

		service.viewerToMeshIds = function (viewer, viewerIds) {
			const result = new modelViewerModelIdSetService.ObjectIdSet();
			viewerIds.forEach(function (viewerId) {
				const key = viewer.model.getSCInstanceKey(viewerId);

				const subModelId = service.inclusionIdToSubModelId(viewer, key[0]);
				let modelMeshIds = result[subModelId];
				if (!modelMeshIds) {
					result[subModelId] = modelMeshIds = [];
				}
				modelMeshIds.push(key[1]);
			});
			return result;
		};

		service.meshToViewerIds = function (viewer, meshIds) {
			const actualMeshIds = meshIds.normalizeToArrays();

			const result = [];
			Object.keys(actualMeshIds).forEach(function (subModelId) {
				if (actualMeshIds[subModelId].length > 0) {
					const inclusionId = service.subModelIdToInclusionId(viewer, subModelId);
					actualMeshIds[subModelId].forEach(function (meshId) {
						const viewerId = viewer.model.getNodeIDFromSCInstanceKey(inclusionId, meshId);
						result.push(viewerId);
					});
				}
			});
			return result;
		};

		service.viewerToObjectIds = function (viewer, viewerIds) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				return treeInfo.meshToMinimalObjectIds(service.viewerToMeshIds(viewer, viewerIds));
			} else {
				return null;
			}
		};

		service.objectToViewerIds = function (viewer, objectIds) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				return service.meshToViewerIds(viewer, treeInfo.objectToMeshIds(objectIds));
			} else {
				return null;
			}
		};

		service.viewerToObjectId = function (viewer, viewerId) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			if (treeInfo) {
				const meshId = service.viewerToMeshId(viewer, viewerId);
				if (meshId) {
					const modelTreeInfo = treeInfo[meshId.subModelId];
					if (modelTreeInfo) {
						const obj = modelTreeInfo.byMeshId[meshId.meshId];
						if (obj) {
							return {
								subModelId: meshId.subModelId,
								objectId: obj.id
							};
						}
					}
				}
			}
			return null;
		};

		// TODO: remove?
		/*
		function retrieveFilterAppliedMessenger(viewer, doCreate) {
			const pm = viewer.rib$filterAppliedPlatformMessenger;
			if (!pm && doCreate) {
				pm = viewer.rib$filterAppliedPlatformMessenger = new PlatformMessenger();
			}
			return pm;
		}

		service.registerFilterApplied = function (viewer, handler) {
			retrieveFilterAppliedMessenger(viewer, true).register(handler);
		};

		service.unregisterFilterApplied = function (viewer, handler) {
			const pm = retrieveFilterAppliedMessenger(viewer, false);
			if (pm) {
				pm.unregister(handler);
			}
		};

		function fireFilterApplied(viewer) {
			const pm = retrieveFilterAppliedMessenger(viewer, false);
			if (pm) {
				pm.fire();
			}
		}
		*/

		service.setViewerActive = function (viewer, isActive) {
			viewer.rib$isActive = !!isActive;
		};

		service.getViewerActive = function (viewer) {
			return !!viewer.rib$isActive;
		};

		service.markViewerAsDiscarded = function (viewer) {
			viewer.rib$discarded = true;
		};

		service.isViewerDiscarded = function (viewer) {
			return !!viewer.rib$discarded;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name selectFromPoint
		 * @method
		 * @methodOf modelViewerHoopsLinkService
		 * @description Modifies the selection based upon a 2D point in the view.
		 * @param {Communicator.WebViewer} viewer The web viewer.
		 * @param {Communicator.Point2} point The selected point.
		 * @param {boolean} addToSelection Indicates whether the current selection should be extended.
		 * @param {boolean} expandToParent Indicates whether the selection should be extended to the hit item's
		 *                                 parent object.
		 */
		service.selectFromPoint = function (viewer, point, addToSelection, expandToParent) {
			const view = viewer.view;

			const pickConfig = new Communicator.IncrementalPickConfig();
			pickConfig.respectVisibility = false;

			let hitObjectIds = new modelViewerModelIdSetService.ObjectIdSet();
			const modelViewerSelectabilityService = $injector.get('modelViewerSelectabilityService');
			const selectabilityInfo = modelViewerSelectabilityService.getSelectabilityInfo(viewer);
			return view.beginRayDrillSelection(point, 1, pickConfig).then(function (incSelId) {
				return platformPromiseUtilitiesService.doWhile(function (incSelId) {
					return view.advanceIncrementalSelection(incSelId).then(function (selItems) {
						if (_.isArray(selItems) && (selItems.length > 0)) {
							for (let i = 0; i < selItems.length; i++) {
								const hitMeshId = service.viewerToMeshId(viewer, selItems[i].getNodeId());
								if (hitMeshId) {
									if (selectabilityInfo.isMeshSelectable(hitMeshId.subModelId, hitMeshId.meshId)) {
										const treeInfo = modelViewerObjectTreeService.getTree();
										hitObjectIds[hitMeshId.subModelId] = [hitMeshId.meshId];
										hitObjectIds = treeInfo.meshToObjectIds(hitObjectIds);
										return null;
									}
								}
							}
							return incSelId;
						} else {
							return null;
						}
					});
				}, function (incSelId) {
					return !!incSelId;
				}, incSelId).then(function () {
					return view.endIncrementalSelection(incSelId);
				});
			}).then(function () {
				modelViewerCompositeModelObjectSelectionService.integrateSelection(hitObjectIds, addToSelection, expandToParent);
			});
		};

		function gatherNodesFromIncrementalSelection(config) {
			const view = config.viewer.view;
			const nodeIds = [];

			return config.initialPromise.then(function (incSelId) {
				return platformPromiseUtilitiesService.doWhile(function (incSelId) {
					return view.advanceIncrementalSelection(incSelId).then(function (selItems) {
						if (_.isArray(selItems) && (selItems.length > 0)) {
							platformCollectionUtilitiesService.appendItems(nodeIds, _.map(selItems, function (selItem) {
								return selItem.getNodeId();
							}));
							return incSelId;
						} else {
							return null;
						}
					});
				}, function (incSelId) {
					return !!incSelId;
				}, incSelId).then(function () {
					return view.endIncrementalSelection(incSelId);
				});
			}).then(() => nodeIds);
		}

		service.selectFromRectangle = function (viewer, point1, point2, addToSelection, includePartiallyContained) {
			const ptMin = new Communicator.Point2(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
			const ptMax = new Communicator.Point2(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));

			const pickConfig = new Communicator.IncrementalPickConfig();
			pickConfig.respectVisibility = false;
			pickConfig.mustBeFullyContained = !includePartiallyContained;

			return gatherNodesFromIncrementalSelection({
				initialPromise: viewer.view.beginScreenSelectByArea(ptMin, ptMax, pickConfig),
				viewer: viewer
			}).then(function (nodeIds) {
				let meshIds = service.viewerToMeshIds(viewer, nodeIds);
				const modelViewerSelectabilityService = $injector.get('modelViewerSelectabilityService');
				const selectabilityInfo = modelViewerSelectabilityService.getSelectabilityInfo(viewer);
				meshIds = selectabilityInfo.reduceToSelectableMeshIds(meshIds);
				const treeInfo = modelViewerObjectTreeService.getTree();
				const objectIds = treeInfo.meshToMinimalObjectIds(meshIds);
				modelViewerCompositeModelObjectSelectionService.integrateSelection(objectIds, addToSelection, false);
			});
		};

		service.findMeshesNearPoint = function (viewer, point, radius, includePartiallyContained = true) {
			const pickConfig = new Communicator.IncrementalPickConfig();
			pickConfig.respectVisibility = false;
			pickConfig.mustBeFullyContained = !includePartiallyContained;

			return gatherNodesFromIncrementalSelection({
				initialPromise: viewer.view.beginSphereSelection(point, radius, pickConfig),
				viewer: viewer
			}).then(function (nodeIds) {
				return service.viewerToMeshIds(viewer, nodeIds);
			});
		};

		return service;
	}
})(angular);
