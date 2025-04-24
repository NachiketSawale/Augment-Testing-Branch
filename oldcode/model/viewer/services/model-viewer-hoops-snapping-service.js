/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsSnappingService
	 * @function
	 *
	 * @description Provides tools to implement snapping to special points in the current 3D model.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsSnappingService',
		modelViewerHoopsSnappingService);

	modelViewerHoopsSnappingService.$inject = ['_', 'Communicator', '$q',
		'modelViewerHoopsPointProjectionService', 'modelViewerModelSelectionService',
		'modelViewerHoopsLinkService', '$injector', 'PlatformMessenger', 'platformPromiseUtilitiesService',
		'modelViewerCompositeModelObjectSelectionService'];

	function modelViewerHoopsSnappingService(_, Communicator, $q,
		modelViewerHoopsPointProjectionService, modelViewerModelSelectionService,
		modelViewerHoopsLinkService, $injector, PlatformMessenger, platformPromiseUtilitiesService,
		modelViewerCompositeModelObjectSelectionService) {

		const service = {};

		let modelViewerSubModelAlignmentService;

		class SnappingProvider {
			constructor(id) {
				this.id = id;
				this._links = [];
			}

			attachToViewer(viewer, pph) {
				const link = new SnappingProviderLink(this, viewer, pph);
				this._links.push(link);
				return link;
			}

			initializeForViewer() {
			}

			finalizeForViewer() {
			}

			updatePointerPositionsForViewer() {
			}
		}

		const snappingProviders = [];

		function registerSnappingProvider(config) {
			if (!_.isObject(config)) {
				throw new Error('The config argument must be an object.');
			}
			if (!_.isString(config.id)) {
				throw new Error('The config object must contain an id string.');
			}

			const sp = new SnappingProvider(config.id);
			sp.title = config.title;
			sp.icon = config.icon;

			if (_.isFunction(config.initializeForViewer)) {
				sp.initializeForViewer = config.initializeForViewer;
			}

			if (_.isFunction(config.finalizeForViewer)) {
				sp.finalizeForViewer = config.finalizeForViewer;
			}

			if (_.isFunction(config.updatePointerPositionsForViewer)) {
				sp.updatePointerPositionsForViewer = config.updatePointerPositionsForViewer;
			}

			snappingProviders.push(sp);
		}

		function registerBoxPoints(boxes, setPointFn, idPrefix) {
			const allPoints = _.flatten(_.map(boxes, box => _.concat(box.getCorners(), [box.center()])));
			allPoints.forEach(function (pt, idx) {
				setPointFn(idPrefix + '_' + idx, pt);
			});
		}

		function registerMeshPoints(meshPoints, setPointFn, idPrefix) {
			for (let i = 0; i < meshPoints.length; i++) {
				setPointFn(idPrefix + '_' + i, meshPoints[i]);
			}
		}

		/*registerSnappingProvider({
			id: 'scenePoints',
			title: 'model.viewer.snapping.scenePoints',
			icon: 'tlb-icons ico-view-snap-scene',
			initializeForViewer: function (info) {
				info.setPoint('origin', 0, 0, 0);
			}
		});
		registerSnappingProvider({
			id: 'subModelBoundingBoxes',
			title: 'model.viewer.snapping.subModelBoundingBoxes',
			icon: 'tlb-icons ico-view-snap-submodel',
			initializeForViewer: function (info) {
				const smMap = info.viewer[modelViewerHoopsLinkService.getSubModelsMapProperty()];

				info.data.updatePoints = function () {
					info.removeAllPoints();

					const retrievalPromises = [];
					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						const rootNodeId = smMap.subModelToRootNode[subModelId];
						if (_.isInteger(rootNodeId)) {
							retrievalPromises.push(info.viewer.model.getNodesBounding([rootNodeId]));
						}
					});

					if (retrievalPromises.length > 0) {
						$q.all(retrievalPromises).then(function (bBoxes) {
							registerBoxPoints(bBoxes, function () {
								return info.setPoint.apply(info, arguments);
							}, 'bbp');
						});
					}
				};

				if (!modelViewerSubModelAlignmentService) {
					modelViewerSubModelAlignmentService = $injector.get('modelViewerSubModelAlignmentService');
				}
				modelViewerSubModelAlignmentService.registerSubModelTransformationChanged(info.data.updatePoints);
				info.data.updatePoints();
			},
			finalizeForViewer: function (info) {
				modelViewerSubModelAlignmentService.unregisterSubModelTransformationChanged(info.data.updatePoints);
			}
		});
		registerSnappingProvider({
			id: 'objectCorners',
			title: 'model.viewer.snapping.selectionBoundingBoxes',
			icon: 'tlb-icons ico-view-snap-select',
			initializeForViewer: function (info) {
				info.data.updatePoints = function () {
					info.removeAllPoints();

					const selObjectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
					if (!selObjectIds.isEmpty()) {
						const nodeIds = modelViewerHoopsLinkService.objectToViewerIds(info.viewer, selObjectIds);
						return info.viewer.model.getNodesBounding(nodeIds).then(function (bBox) {
							registerBoxPoints([bBox], function () {
								return info.setPoint.apply(info, arguments);
							}, 'selbbp');
						});
					}
				};

				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(info.data.updatePoints);
				info.data.updatePoints();
			},
			finalizeForViewer: function (info) {
				modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(info.data.updatePoints);
			}
		});
		registerSnappingProvider({
			id: 'objectVertices',
			title: 'model.viewer.snapping.selectionVertices',
			icon: 'tlb-icons ico-measure-intersection',
			initializeForViewer: function (info) {
				info.data.updatePoints = function () {
					info.removeAllPoints();
					info.meshPoints = [];

					const selObjectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
					if (!selObjectIds.isEmpty()) {
						const nodeIds = modelViewerHoopsLinkService.objectToViewerIds(info.viewer, selObjectIds);
						for (let nodeId of nodeIds) {
							info.viewer.model.getNodeMeshData(nodeId).then(function (meshDataCopy) {
								for (let faceIter = meshDataCopy.faces.iterate(); !faceIter.done();){
									info.meshPoints.push(faceIter.next().position);
								}
								if(info.meshPoints && info.meshPoints.length>0) {
									registerMeshPoints(info.meshPoints, function () {
										return info.setPoint.apply(info, arguments);
									}, 'selvt');
								}
							});
						}
					}
				};

				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(info.data.updatePoints);
				info.data.updatePoints();
			},
			finalizeForViewer: function (info) {
				modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(info.data.updatePoints);
			}
		});*/
		registerSnappingProvider({
			id: 'nearestVertices',
			title: 'model.viewer.snapping.nearestVertices',
			icon: 'tlb-icons ico-view-snap-endpoint',
			initializeForViewer: function (info) {
				//if (!modelViewerSubModelAlignmentService) {
				//	modelViewerSubModelAlignmentService = $injector.get('modelViewerSubModelAlignmentService');
				//}
				//modelViewerSubModelAlignmentService.registerSubModelTransformationChanged(info.data.updatePointsWhenMouseMove);
			},
			updatePointerPositionsForViewer: function (info, point) {
				info.data.updatePointsWhenMouseMove = function (point) {
					const pickConfig = new Communicator.IncrementalPickConfig();
					pickConfig.respectVisibility = false;

					const modelViewerSelectabilityService = $injector.get('modelViewerSelectabilityService');
					const selectabilityInfo = modelViewerSelectabilityService.getSelectabilityInfo(info.viewer);
					let hitObjectId;
					info.meshPointsTemp = [];
					info.meshPoints = [];
					//let idx = 0;

					return info.viewer.view.beginRayDrillSelection(point, 1, pickConfig).then(function (incSelId) {
						return platformPromiseUtilitiesService.doWhile(function (incSelId) {
							return info.viewer.view.advanceIncrementalSelection(incSelId).then(function (selItems) {
								if (_.isArray(selItems) && (selItems.length > 0)) {
									for (let i = 0; i < selItems.length; i++) {
										const hitMeshId = modelViewerHoopsLinkService.viewerToMeshId(info.viewer, selItems[i].getNodeId());
										if (hitMeshId) {
											if (selectabilityInfo.isMeshSelectable(hitMeshId.subModelId, hitMeshId.meshId)) {
												hitObjectId = selItems[i].getNodeId();
												if (hitObjectId !== info.hitObjectId){
													info.removeAllPoints();
													info.hitObjectId = hitObjectId;

													let objectMatrix = info.viewer.model.getNodeNetMatrix(hitObjectId).copy();
													info.viewer.model.getNodeMeshData(hitObjectId).then(function (meshDataCopy) {
														for (let faceIter = meshDataCopy.faces.iterate(); !faceIter.done();){
															let pt = faceIter.next().position;
															info.meshPointsTemp.push(new Communicator.Point3(pt[0], pt[1], pt[2]));
														}

														if(info.meshPointsTemp && info.meshPointsTemp.length>0) {
															objectMatrix.transformArray(info.meshPointsTemp, info.meshPoints);
															registerMeshPoints(info.meshPoints, function () {
																return info.setPoint.apply(info, arguments);
															}, 'nearestvt');

															info.invalidatePointsAfterSet();
														}
													});
												}
												break;
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
							return info.viewer.view.endIncrementalSelection(incSelId);
						});
					}).then(function () {
						return hitObjectId;
					}, function (reason) {
						//console.log('failure: ' + reason);
					});
				};

				info.data.updatePointsWhenMouseMove(point);
			},
			finalizeForViewer: function (info) {
				//modelViewerSubModelAlignmentService.unregisterSubModelTransformationChanged(info.data.updatePointsWhenMouseMove);
			}
		});

		service.generateToolBar = function () {
			const activationMap = {};

			const onSnappingConfigChanged = new PlatformMessenger();

			function toggleSnappingProvider(id, item) {
				activationMap[id] = Boolean(item.value);
				onSnappingConfigChanged.fire();
			}

			const menuItem = {
				id: 'snappingOptions',
				type: 'sublist',
				list: {
					showTitles: true,
					items: _.map(snappingProviders, function (sp) {
						return {
							id: sp.id,
							type: 'check',
							caption: sp.title,
							iconClass: sp.icon,
							fn: toggleSnappingProvider
						};
					})
				}
			};

			return {
				menuItem: menuItem,
				getConfig: () => _.clone(activationMap),
				registerConfigChanged: function (handler) {
					onSnappingConfigChanged.register(handler);
				},
				unregisterConfigChanged: function (handler) {
					onSnappingConfigChanged.unregister(handler);
				},
				setToggleSnappingProvider: function (id, flag){
					let item = menuItem.list.items.filter( x => x.id === id)[0];
					item.value = flag;
					toggleSnappingProvider(id, item);
				}
			};
		};

		class SnappingProviderLink {
			constructor(owner, viewer, pph) {
				function generatePointId(purePointId) {
					return owner.id + '$' + purePointId;
				}

				this._owner = owner;
				this._viewer = viewer;
				this._pph = pph;
				this._linkData = {};
				this._meshPoints = [];
				this._hitObjectId = null;

				const that = this;

				that._infoObject = {
					setPoint: function (id, positionOrX, y, z) {
						const ptId = generatePointId(id);
						that._pph.setPoint(ptId, positionOrX, y, z);
						that._pph.setPointInfo(ptId, {
							snappingProvider: owner.id
						});
					},
					removePoint: function (id) {
						const ptId = generatePointId(id);
						that._pph.removePoint(ptId);
					},
					removeAllPoints: function () {
						that._pph.removePointsByFilter(ptInfo => ptInfo.snappingProvider === owner.id);
					},
					invalidatePointsAfterSet: function() {
						that._pph.invalidatePoints();
					},
					viewer: viewer,
					data: that._linkData,
					meshPoints: that._meshPoints,
					hitObjectId: that._hitObjectId
				};

				owner.initializeForViewer(that._infoObject);
			}

			detach() {
				this._owner.finalizeForViewer({
					viewer: this._viewer,
					data: this._linkData
				});

				const idx = this._owner._links.indexOf(this);
				if (idx >= 0) {
					this._owner._links.splice(idx, 1);
				}
			}

			updatePointerPositions(positions) {
				if (this._owner.id === 'nearestVertices') {
					this._owner.updatePointerPositionsForViewer(this._infoObject, positions['pointer']);
				}
			}
		}

		class SnappingManager {
			constructor(viewer, toolBarLink) {
				const that = this;

				that._viewer = viewer;
				that._toolBarLink = toolBarLink;

				that._eligibleSnappingGroups = that._toolBarLink.getConfig();
				that._configChanged = function () {
					that._eligibleSnappingGroups = that._toolBarLink.getConfig();
					if (that.pph) {
						that.pph.invalidatePoints();
					}
				};
				that._toolBarLink.registerConfigChanged(that._configChanged);

				that.pph = new modelViewerHoopsPointProjectionService.PointProjectionHelper(viewer);

				that._providerLinks = _.map(snappingProviders, sp => sp.attachToViewer(viewer, that.pph));

				that._pointerPositions = {};
				that._propagateUpdatePointerPosition = _.debounce(function doPropagatePointerPosition () {
					if(that._providerLinks) {
						that._providerLinks.forEach(function (pl) {
							pl.updatePointerPositions(_.cloneDeep(that._pointerPositions));
						});
					}
				}, {
					wait: 300,
					maxWait: 500
				});
			}

			dispose() {
				this._providerLinks.forEach(function (spl) {
					spl.detach();
				});
				this._providerLinks = null;

				this._toolBarLink.unregisterConfigChanged(this._configChanged);

				this.pph.dispose();
				this._isDisposed = true;
			}

			findPointAt(x, y) {
				const that = this;

				const results = that.pph.findPointsAt([x, y], {
					radius: 20,
					maxCount: 1,
					filter: function (ptInfo) {
						return that._eligibleSnappingGroups[ptInfo.info.snappingProvider];
					}
				});
				return results.length > 0 ? results[0] : null;
			}

			updatePointerPosition(posId, position) {
				this._pointerPositions[posId] = position ? {
					x: position.x,
					y: position.y
				} : null;
				this._propagateUpdatePointerPosition();
			}
		}

		service.SnappingManager = SnappingManager;

		return service;
	}
})(angular);
