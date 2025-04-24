/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.map';

	/**
	 * @ngdoc controller
	 * @name modelMapAlignmentController
	 * @function
	 *
	 * @description
	 * Controller for the map alignment container.
	 **/
	angular.module(moduleName).controller('modelMapAlignmentController',
		ModelMapAlignmentController);

	ModelMapAlignmentController.$inject = ['$scope', 'modelViewerModelSelectionService', 'modelViewerHoopsLoadingService',
		'Communicator', '_', '$log', 'modelMapHoopsAlignmentMarkerService', 'modelMapLevelDataService',
		'platformMenuListUtilitiesService', 'modelViewerHoopsRuntimeDataService', 'modelViewerHoopsUtilitiesService',
		'platformPromiseUtilitiesService', '$q', '$timeout', 'modelMapGraphicAlignmentMarkerService',
		'modelMapAlignmentMarkerService', 'PlatformMessenger', '$translate', '$document',
		'modelViewerHoopsOperatorUtilitiesService'];

	function ModelMapAlignmentController($scope, modelViewerModelSelectionService, modelViewerHoopsLoadingService,
		Communicator, _, $log, modelMapHoopsAlignmentMarkerService, modelMapLevelDataService,
		platformMenuListUtilitiesService, modelViewerHoopsRuntimeDataService, modelViewerHoopsUtilitiesService,
		platformPromiseUtilitiesService, $q, $timeout, modelMapGraphicAlignmentMarkerService,
		modelMapAlignmentMarkerService, PlatformMessenger, $translate, $document,
		modelViewerHoopsOperatorUtilitiesService) {

		const alignmentMaster = new modelMapLevelDataService.MapAlignmentMaster();

		const onContentResized = new PlatformMessenger();
		const onRefreshRequested = new PlatformMessenger();

		$scope.viewerConfig = {
			getUiAddOns: function () {
				return $scope.getUiAddOns();
			},
			statusFieldId: 'status',
			registerSizeChanged: function (handler) {
				onContentResized.register(handler);
			},
			unregisterSizeChanged: function (handler) {
				onContentResized.unregister(handler);
			},
			additionalViewerInitialization: function (info) {
				return retrieveLevelMeshInfo().then(function () {
					info.viewer.setCallbacks({
						camera: function () {
							if ($scope.viewerMarkerManager) {
								$timeout(function () {
									$scope.viewerMarkerManager.redraw();
								}, 50);
							}
							retrieveLevelMeshInfo().then(function (info) {
								if (info) {
									info.redrawOverlay(modelMapLevelDataService.getSelected());
								}
							});
						}
					});

					info.viewer.operatorManager.clear();
					applySelectedProjection();

					$scope.viewerMarkerManager = modelMapHoopsAlignmentMarkerService.createManager(info.viewer, $scope.viewerOverlayLink, {
						moveMarker: function (markerId, x, y) {
							const selLevel = modelMapLevelDataService.getSelected();
							if (!selLevel) {
								return;
							}

							const refPtIndex = modelMapAlignmentMarkerService.getReferenceMarkerIndexFromId(markerId);
							if (_.isNumber(refPtIndex)) {
								modelMapLevelDataService.setAlignmentPoint(selLevel, refPtIndex, {
									x: x,
									y: y
								});
								switch (refPtIndex) {
									case 1:
										alignmentMaster.setModelPoint1(x, y);
										break;
									case 2:
										alignmentMaster.setModelPoint2(x, y);
										break;
								}
								alignmentMaster.updateTransformation(selLevel);
							}
						}
					});
					return applySelectedMode();
				}).then(function () {
					levelsLoaded();
				});
			},
			useModelSelectionService: true,
			registerRefreshRequested: function (handler) {
				onRefreshRequested.register(handler);
			},
			unregisterRefreshRequested: function (handler) {
				onRefreshRequested.unregister(handler);
			}
		};

		//
		const statusBarLink = (function initStatusBar() {
			const sb = $scope.getUiAddOns().getStatusBar();
			sb.showFields([{
				id: 'status',
				type: 'text',
				align: 'left'
			}, {
				id: 'model',
				type: 'text',
				align: 'right'
			}]);
			return sb.getLink();
		})();
		$scope.$watch('viewer._alreadyShutDown', function () {
			const uiAddOns = $scope.getUiAddOns();
			const whiteBoard = uiAddOns.getWhiteboard();
			if ($scope.viewer) {
				const viewer = $scope.viewer();
				if (viewer._alreadyShutDown === true) {
					whiteBoard.setInfo($translate.instant('model.viewer.modelTimeout'));
					whiteBoard.setVisible(true);
				} else if (viewer._alreadyShutDown === false) {
					whiteBoard.setVisible(false);
					updateSelectedMapLevel();
				}
			}
		});
		const Marker = modelMapAlignmentMarkerService.Marker;

		const removeInitWatch = $scope.$watch(function areGraphicsLinksReady() {
			return $scope.displayLink && $scope.graphicOverlayLink;
		}, function initializeGraphics(newValue) {
			if (!newValue) {
				return;
			}

			removeInitWatch();

			$scope.graphicsMarkerManager = modelMapGraphicAlignmentMarkerService.createManager($scope.displayLink, $scope.graphicOverlayLink, {
				moveMarker: function (markerId, x, y) {
					const selLevel = modelMapLevelDataService.getSelected();
					if (!selLevel) {
						return;
					}

					const refPtIndex = modelMapAlignmentMarkerService.getReferenceMarkerIndexFromId(markerId);
					switch (refPtIndex) {
						case 1:
							alignmentMaster.setMapPoint1(x, y);
							break;
						case 2:
							alignmentMaster.setMapPoint2(x, y);
							break;
					}
					alignmentMaster.updateTransformation(selLevel);
					modelMapLevelDataService.markItemAsModified(selLevel);
				}
			});
		});

		function updateSelectedModel() {
			const selModel = modelViewerModelSelectionService.getSelectedModel();
			if (!selModel) {
				statusBarLink.updateFields({
					model: {
						value: ''
					}
				});
			} else {
				statusBarLink.updateFields({
					model: {
						value: selModel.info.getNiceName()
					}
				});
			}
		}

		modelViewerModelSelectionService.onSelectedModelChanged.register(updateSelectedModel);

		$scope.resizeContent = function () {
			onContentResized.fire();
			if ($scope.viewerMarkerManager) {
				$scope.viewerMarkerManager.redraw();
			}
		};

		$scope.onContentResized($scope.resizeContent);

		let modeSelector;

		function retrieveLevelMeshInfo() {
			const infoProperty = 'rib$levelMeshInfo';

			if ($scope.viewer && $scope.viewerOverlayLink && modelViewerHoopsRuntimeDataService.isRuntimeDataReady($scope.viewer())) {
				const viewer = $scope.viewer();

				let info = viewer[infoProperty];
				if (!info) {
					const bBox = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer);
					const levelCorners = [
						new Communicator.Point3(bBox.min.x - 1, bBox.min.y - 1, 0),
						new Communicator.Point3(bBox.max.x + 1, bBox.min.y - 1, 0),
						new Communicator.Point3(bBox.max.x + 1, bBox.max.y + 1, 0),
						new Communicator.Point3(bBox.min.x - 1, bBox.max.y + 1, 0)
					];

					info = {
						levelPlanes: modelMapLevelDataService.getLevelPlanes(bBox),
						byLevelId: {},
						parentNodeId: viewer.model.createNode(undefined, 'levels', null, null, false),
						markedCornerPoint: null,
						cuttingSections: {
							upper: viewer.cuttingManager.getCuttingSection(0),
							lower: viewer.cuttingManager.getCuttingSection(1),
							setActive: function (active) {
								const funcName = active ? 'activate' : 'deactivate';
								const that = this;
								return platformPromiseUtilitiesService.allSequentially(Object.keys(that), function (csName) {
									const cs = that[csName];
									if (_.isObject(cs) && !_.isFunction(cs) && _.isFunction(cs[funcName])) {
										return $q.when(cs[funcName]());
									}
									return $q.resolve();
								});
							}
						},
						selCutMode: 'none',
						addLevel: function (level) {
							const that = this;
							const levelInfo = {
								parentNodeId: viewer.model.createNode(this.parentNodeId, 'level-' + level.Id)
							};
							this.byLevelId[level.Id] = levelInfo;
							return platformPromiseUtilitiesService.allSequentially(that.levelPlanes, function (plane) {
								const mid = new Communicator.MeshInstanceData(that.planeMeshId);
								mid.setCreationFlags(Communicator.MeshInstanceCreationFlags.DoNotLight | Communicator.MeshInstanceCreationFlags.DoNotCut);
								mid.setInstanceName('level-' + level.Id + '/' + plane.name);
								return viewer.model.createMeshInstance(mid, levelInfo.parentNodeId).then(function (nodeId) {
									return viewer.model.setNodesVisibility([nodeId], modeSelector && (modeSelector.getSelection() === 'levels')).then(function () {
										return nodeId;
									});
								}).then(function (nodeId) {
									const result = {};
									result[plane.name + 'NodeId'] = nodeId;
									return result;
								});
							}).then(function (nodeIds) {
								_.assign.apply(null, _.concat(levelInfo, nodeIds));
								return that.updateLevel(level);
							});
						},
						removeLevel: function (level) {
							const that = this;
							const levelInfo = this.byLevelId[level.Id];
							if (levelInfo) {
								return viewer.model.deleteNode(levelInfo.parentNodeId).then(function () {
									delete that.byLevelId[level.Id];
								});
							}
						},
						clearLevels: function () {
							const that = this;

							const allLevelParentNodeIds = _.map(Object.keys(that.byLevelId), function (key) {
								const lvl = that.byLevelId[key];
								return lvl.parentNodeId;
							});

							return platformPromiseUtilitiesService.allSequentially(allLevelParentNodeIds, function (parentId) {
								return viewer.model.deleteNode(parentId);
							}).then(function () {
								Object.keys(that.byLevelId).forEach(function (key) {
									delete that.byLevelId[key];
								});
							});
						},
						updateLevel: function (level, planeNames) {
							const that = this;
							const levelInfo = this.byLevelId[level.Id];
							if (levelInfo) {
								return platformPromiseUtilitiesService.allSequentially(that.levelPlanes, function (plane) {
									if (!_.isObject(planeNames) || planeNames[plane.name]) {
										const planeNodeId = levelInfo[plane.name + 'NodeId'];
										const zValue = plane.getEffectivePlaneZ(level);
										const m = new Communicator.Matrix().setTranslationComponent(0, 0, zValue);
										return viewer.model.setNodeMatrix(planeNodeId, m);
									} else {
										return $q.resolve();
									}
								}).then(function () {
									return that.updateLevelCuttingPlanes(level);
								});
							}
						},
						updateLevelCuttingPlanes: function (level) {
							const that = this;
							const levelInfo = this.byLevelId[level.Id];
							if (levelInfo) {
								let bounds = null;
								switch (that.selCutMode) {
									case 'level':
										bounds = (function () {
											const vals = that.levelPlanes.getZValues(level, ['zMax', 'zMin']);
											return {
												upper: vals.zMax,
												lower: vals.zMin
											};
										})();
										break;
									case 'mapSlice':
										bounds = (function () {
											const vals = that.levelPlanes.getZValues(level, ['zLevel', 'zLevelBoundary']);
											return {
												upper: vals.zLevel,
												lower: vals.zLevelBoundary
											};
										})();
										break;
								}
								if (bounds) {
									const upperPlane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, bounds.upper), new Communicator.Point3(0, 0, 1));
									const lowerPlane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, bounds.lower), new Communicator.Point3(0, 0, -1));
									return that.cuttingSections.upper.setPlane(0, upperPlane).then(function () {
										return that.cuttingSections.lower.setPlane(0, lowerPlane);
									});
								}
							}
							return $q.resolve();
						},
						selectLevel: function (level) {
							const that = this;

							const nodeColors = {};
							const nodeOpacities = {};
							Object.keys(that.byLevelId).forEach(function (key) {
								key = parseInt(key);
								const levelInfo = that.byLevelId[key];
								const settings = (function () {
									if (level && (key === level.Id)) {
										return {
											opacity: 0.6,
											selected: true
										};
									} else {
										return {
											opacity: 0.3,
											selected: false
										};
									}
								})();

								that.levelPlanes.forEach(function (plane) {
									const nodeId = levelInfo[plane.name + 'NodeId'];
									nodeColors[nodeId] = modelViewerHoopsUtilitiesService.rgbColorToViewerColor(plane.getColor(settings.selected));
									nodeOpacities[nodeId] = settings.opacity;
								});
							});

							that.redrawOverlay(level);

							return viewer.model.setNodesColors(nodeColors, false).then(function () {
								return viewer.model.setNodesOpacities(nodeOpacities);
							});
						},
						redrawOverlay: function (level) {
							const that = this;

							const levelMarkers = [];
							if (level) {
								this.markedCornerPoint = (function pickMarkedCorner() {
									const pts = _.map(levelCorners, function (pt3d) {
										return {
											pt3d: pt3d,
											pt2d: viewer.view.projectPoint(pt3d)
										};
									});
									pts.sort(function (a, b) {
										if (a.pt2d.x < b.pt2d.x) {
											return -1;
										} else if (a.pt2d.x > b.pt2d.x) {
											return 1;
										} else {
											if (a.pt2d.y > b.pt2d.y) {
												return -1;
											} else if (a.pt2d.y < b.pt2d.y) {
												return 1;
											} else {
												return 0;
											}
										}
									});

									return pts[0].pt3d.copy();
								})();

								that.levelPlanes.forEach(function (plane) {
									levelMarkers.push((function () {
										const pt3d = that.markedCornerPoint.copy();
										pt3d.z = plane.getEffectivePlaneZ(level);
										const pt2d = viewer.view.projectPoint(pt3d);
										return {
											id: plane.name,
											x: pt2d.x,
											y: pt2d.y,
											zValue: pt3d.z
										};
									})());
								});
							} else {
								this.markedCornerPoint = null;
							}
							$scope.viewerOverlayLink.updateLevelMarkers(levelMarkers);
						},
						setVisible: function (visible) {
							return viewer.model.setNodesVisibility([this.parentNodeId], !!visible);
						}
					};
					viewer[infoProperty] = info;

					$scope.viewerOverlayLink.setLevelInteractionListener({
						moveMarker: function (id, x, y) {
							if (info.markedCornerPoint) {
								const selLevel = modelMapLevelDataService.getSelected();
								const levelPlane = info.levelPlanes.byName[id];
								if (selLevel && levelPlane) {
									const viewDir = modelViewerHoopsUtilitiesService.getViewDirection(viewer.view.getCamera());
									viewDir.z = 0;
									const plane = Communicator.Plane.createFromPointAndNormal(info.markedCornerPoint, viewDir);
									const ray = viewer.view.raycastFromPoint(new Communicator.Point2(x, y));
									const intersection = plane.rayIntersection(ray);
									levelPlane.setValue(selLevel, intersection.z);
									modelMapLevelDataService.markItemAsModified(selLevel);

									const changedPlanes = {};
									changedPlanes[id] = true;
									levelPlane.getDependentPlanes().forEach(function (planeId) {
										changedPlanes[planeId] = true;
									});
									info.updateLevel(selLevel, changedPlanes);
								}
							}
						},
						rotateModel: function (deltaX, deltaY) {
							const displacement = [];
							displacement.x = deltaX;
							displacement.y = deltaY;
							const geoInfo = modelViewerHoopsOperatorUtilitiesService.getGeneralGeometryInfo(viewer);
							modelViewerHoopsOperatorUtilitiesService.selectionAwareTurntableOperatorRotate(viewer, displacement, geoInfo);
							const lastCamPos = geoInfo.camPos;
							const lastCamTarget = geoInfo.camTarget;
							const view = viewer.view;
							const camera = view.getCamera();
							camera.setPosition(lastCamPos);
							camera.setTarget(lastCamTarget);
							camera.setUp(new Communicator.Point3(0, 0, 1));
							viewer.view.setCamera(camera);
							viewer.view.updateCamera(camera);
						},
						zoomModel: function (x, y, delta) {
							if (delta > 0) {
								modelViewerHoopsOperatorUtilitiesService.zoomIn(viewer, delta / 40, new Communicator.Point2(x, y));
							} else {
								modelViewerHoopsOperatorUtilitiesService.zoomOut(viewer, -delta / 40, new Communicator.Point2(x, y));
							}
						},
						panModel: function (sx, sy, ex, ey) {
							const displacement = [];
							displacement.sx = sx;
							displacement.sy = sy;
							displacement.ex = ex;
							displacement.ey = ey;
							modelViewerHoopsOperatorUtilitiesService.panTopView(viewer, displacement);
						}
					});

					const md = new Communicator.MeshData();
					md.setBackfacesEnabled(true);
					md.addFaces(modelViewerHoopsUtilitiesService.pointsToCoordArray([
						levelCorners[0], levelCorners[1], levelCorners[2],
						levelCorners[0], levelCorners[2], levelCorners[3]
					]));
					return viewer.model.createMesh(md).then(function (mId) {
						info.planeMeshId = mId;
					}).then(function () {
						const defaultPlane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, 0), new Communicator.Point3(0, 0, 1));
						return info.cuttingSections.upper.addPlane(defaultPlane).then(function () {
							return info.cuttingSections.lower.addPlane(defaultPlane);
						});
					}).then(function () {
						return info;
					});
				}
				return $q.resolve(info);
			}
			return $q.resolve(null);
		}

		const perspectiveSelector = platformMenuListUtilitiesService.createFlatItems({
			asRadio: true,
			itemFactory: function (item) {
				return {
					id: item.id,
					caption: item.caption,
					iconClass: 'tlb-icons ico-view-' + item.id
				};
			},
			items: [{
				id: 'perspective',
				caption: 'model.viewer.projectionPerspective'
			}, {
				id: 'orthographic',
				caption: 'model.viewer.projectionOrthograph'
			}]
		});
		perspectiveSelector.setSelection('perspective');

		function applySelectedProjection() {
			let projection;
			switch (perspectiveSelector.getSelection()) {
				case 'orthographic':
					projection = Communicator.Projection.Orthographic;
					break;
				default:
					projection = Communicator.Projection.Perspective;
					break;
			}
			if ($scope.viewer) {
				const viewer = $scope.viewer();
				viewer.view.setProjectionMode(projection);
				$timeout(function () {
					if ($scope.viewerMarkerManager) {
						$scope.viewerMarkerManager.redraw();
					}
					retrieveLevelMeshInfo().then(function (info) {
						if (!info) {
							return;
						}

						info.redrawOverlay(modelMapLevelDataService.getSelected());
					});
				}, 100);
			}
		}

		perspectiveSelector.registerSelectionChanged(applySelectedProjection);

		const cutModeSelector = platformMenuListUtilitiesService.createFlatItems({
			asRadio: true,
			dropdown: true,
			id: 'cut',
			iconClass: 'tlb-icons ico-view-cutting-planes',
			title: 'model.map.alignmentEditor.cutMode',
			itemFactory: function (item) {
				return {
					id: item.id,
					caption: item.caption
				};
			},
			items: [{
				id: 'none',
				caption: 'model.map.alignmentEditor.cutModeNone'
			}, {
				id: 'level',
				caption: 'model.map.alignmentEditor.cutModeLevel'
			}, {
				id: 'mapSlice',
				caption: 'model.map.alignmentEditor.cutModeMapSlice'
			}]
		});
		cutModeSelector.setSelection('none');

		function applySelectedCutMode() {
			return retrieveLevelMeshInfo().then(function (info) {
				if (!info) {
					return;
				}

				const selCutMode = cutModeSelector.getSelection();
				info.selCutMode = selCutMode;
				const selLevel = modelMapLevelDataService.getSelected();
				if (!selLevel || (selCutMode === 'none')) {
					return info.cuttingSections.setActive(false);
				}

				return info.updateLevelCuttingPlanes(selLevel).then(function () {
					return info.cuttingSections.setActive(true);
				});
			});
		}

		cutModeSelector.registerSelectionChanged(applySelectedCutMode);

		modeSelector = platformMenuListUtilitiesService.createFlatItems({
			asRadio: true,
			itemFactory: function (item) {
				return {
					id: item.id,
					caption: item.caption,
					iconClass: 'tlb-icons ico-mode-' + item.icon
				};
			},
			items: [{
				id: 'levels',
				caption: 'model.map.alignmentEditor.levelMode',
				icon: 'level'
			}, {
				id: 'alignment',
				caption: 'model.map.alignmentEditor.alignMode',
				icon: 'align'
			}]
		});
		modeSelector.setSelection('alignment');

		function updateViewerActive() {
			const uiAddOns = $scope.getUiAddOns();
			const whiteBoard = uiAddOns.getWhiteboard();

			const selLevel = modelMapLevelDataService.getSelected();
			if (selLevel) {
				if ((modeSelector.getSelection() === 'levels') || selLevel.PrjDocumentFk) {
					whiteBoard.setVisible(false);
				} else {
					whiteBoard.setInfo($translate.instant('model.map.message.documentNotLoaded'));
					whiteBoard.setVisible(true);
				}

			} else {
				whiteBoard.setInfo($translate.instant('model.map.message.levelNotSelected'));
				whiteBoard.setVisible(true);
			}
		}

		function applySelectedMode() {
			if (!$scope.viewer) {
				return;
			}

			const newMode = modeSelector.getSelection();
			let displayConfig;
			switch (newMode) {
				case 'levels':
					displayConfig = {
						orientation: Communicator.ViewOrientation.Iso,
						levelsVisible: true
					};
					break;
				default:
					displayConfig = {
						orientation: Communicator.ViewOrientation.Top,
						levelsVisible: false
					};
					break;
			}

			$scope.viewerOverlayLink.setMode(newMode);

			updateViewerActive();

			return $scope.viewer().view.setViewOrientation(displayConfig.orientation, 800).then(function () {
				return retrieveLevelMeshInfo();
			}).then(function (info) {
				if (info) {
					return info.setVisible(displayConfig.levelsVisible);
				}
			});
		}

		modeSelector.registerSelectionChanged(applySelectedMode);

		(function buildToolBar() {
			const toolItems = [modeSelector.menuItem, perspectiveSelector.menuItem, {
				id: 'refresh',
				type: 'item',
				caption: 'model.viewer.refresh',
				iconClass: 'tlb-icons ico-refresh',
				fn: function () {
					onRefreshRequested.fire();
				}
			}, cutModeSelector.menuItem];

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools'
			});
			$scope.tools.items = toolItems;
			$scope.tools.update();
		})();

		updateSelectedModel();

		function levelsLoaded() {
			retrieveLevelMeshInfo().then(function (info) {
				if (!info) {
					return;
				}

				return info.clearLevels().then(function () {
					const allLevels = modelMapLevelDataService.getList();
					if (_.isArray(allLevels)) {
						platformPromiseUtilitiesService.allSequentially(allLevels, function (lvl) {
							return info.addLevel(lvl);
						}).then(function () {
							updateSelectedMapLevel();
						});
					}
				});
			});
		}

		modelMapLevelDataService.registerListLoaded(levelsLoaded);

		levelsLoaded();

		function levelCreated(newLevel) {
			retrieveLevelMeshInfo().then(function (info) {
				if (!info) {
					return;
				}

				return info.addLevel(newLevel).then(function () {
					updateSelectedMapLevel();
				});
			});
		}

		modelMapLevelDataService.registerItemCreated(levelCreated);

		function updateSelectedMapLevel() {
			updateViewerActive();
			retrieveLevelMeshInfo().then(function (info) {
				if (info) {
					return info.selectLevel(selLevel);
				}
			});
			$scope.mapGraphic = null;
			const selLevel = modelMapLevelDataService.getSelected();
			modelMapLevelDataService.getGraphicsDescriptor(selLevel).then(function (gd) {
				$scope.$evalAsync(function () {
					$scope.mapGraphic = gd;
				});
			});

			updateLevelMarkers();

			$scope.tools.update();
		}

		modelMapLevelDataService.registerSelectionChanged(updateSelectedMapLevel);

		function updateLevelMarkers() {
			if (!$scope.viewer) {
				return;
			}

			const selLevel = modelMapLevelDataService.getSelected();

			const markers = [];
			if (selLevel) {
				let pt1 = modelMapLevelDataService.getAlignmentPoint(selLevel, 1);
				let pt2 = modelMapLevelDataService.getAlignmentPoint(selLevel, 2);

				if (!pt1 || !pt2) {
					const bBox = modelViewerHoopsRuntimeDataService.getBoundingBox($scope.viewer());
					if (!pt1) {
						pt1 = {
							x: bBox.min.x,
							y: bBox.min.y
						};
						modelMapLevelDataService.setAlignmentPoint(selLevel, 1, pt1, true);
					}
					if (!pt2) {
						pt2 = {
							x: bBox.max.x,
							y: bBox.max.y
						};
						modelMapLevelDataService.setAlignmentPoint(selLevel, 2, pt2, true);
					}
				}

				alignmentMaster.setModelPoint1(pt1.x, pt1.y);
				alignmentMaster.setModelPoint2(pt2.x, pt2.y);
				alignmentMaster.deriveMapPointsFromModelPoints(selLevel);

				markers.push(new Marker('ref1', 'ref1', pt1.x, pt1.y));
				markers.push(new Marker('ref2', 'ref2', pt2.x, pt2.y));
			}

			if ($scope.viewerMarkerManager) {
				$scope.viewerMarkerManager.loadMarkers(markers);
				$scope.viewerMarkerManager.redraw();
			}

			if ($scope.graphicsMarkerManager) {
				$scope.graphicsMarkerManager.loadMarkers(_.map(markers, function (m) {
					const result = _.clone(m);
					const transformedPos = alignmentMaster.transformModelToMap(selLevel, m._x, m._y);
					result._x = transformedPos.x;
					result._y = transformedPos.y;
					return result;
				}));
				$scope.graphicsMarkerManager.redraw();
			}
		}

		function mapLevelModified() {
			retrieveLevelMeshInfo().then(function (info) {
				if (!info) {
					return;
				}

				info.redrawOverlay(modelMapLevelDataService.getSelected());
			});
		}

		modelMapLevelDataService.registerItemModified(mapLevelModified);

		$scope.$on('$destroy', function () {
			modelViewerModelSelectionService.onSelectedModelChanged.unregister(updateSelectedModel);
			modelMapLevelDataService.unregisterListLoaded(levelsLoaded);
			modelMapLevelDataService.unregisterSelectionChanged(updateSelectedMapLevel);
			modelMapLevelDataService.unregisterItemModified(mapLevelModified);
			modelMapLevelDataService.unregisterItemCreated(levelCreated);
		});
	}
})(angular);
