/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsOperatorPositioningService
	 * @function
	 *
	 * @description Provides a HOOPS viewer manipulation operator for picking positions in three-dimensional space.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsOperatorPositioningService', ['$q', 'PlatformMessenger',
		'modelViewerHoopsOperatorUtilitiesService', 'Communicator', 'keyCodes', 'modelViewerHoopsRuntimeDataService',
		'modelViewerHoopsUtilitiesService', '_',
		function ($q, PlatformMessenger, modelViewerHoopsOperatorUtilitiesService, Communicator, keyCodes,
		          modelViewerHoopsRuntimeDataService, modelViewerHoopsUtilitiesService, _) {
			var defaultAxisColor = new Communicator.Color(170, 180, 200);
			var activeColor = new Communicator.Color(255, 255, 0);

			function getAnchorCameraEnd(camera) {
				var camPos = camera.getPosition().copy();
				var up = camera.getUp().copy().normalize();
				return Communicator.Point3.subtract(camPos, up);
			}

			var service = {};

			var OperatorBase = modelViewerHoopsOperatorUtilitiesService.OperatorBase;

			var modes = {
				anchor: 1, // 1) set anchor point; 2) choose distance from camera while moving around
				axisIntersection: 2, // move three axes to desired location
				planeBeforeDistance: 3 // 1) pick position on plane perpendicular to viewing direction; 2) choose distance from that plane
			};

			/**
			 * @ngdoc method
			 * @name PositioningOperator
			 * @constructor
			 * @methodOf PositioningOperator
			 * @description Initializes a new instance of an operator for selecting 3D locations.
			 * @param {Communicator.Viewer} viewer The viewer.
			 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
			 *                                operators linked to it.
			 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
			 */
			function PositioningOperator(viewer, viewerSettings, focusViewer) {
				OperatorBase.call(this, viewer, viewerSettings, focusViewer);

				this.ignoreShortcuts = true;
				this.mode = modes.anchor;
				this.markerShapeId = 1; //null

				var that = this;
				this.callUpdateHelperObjectsVisibility = _.debounce(function () {
					updateHelperObjectsVisibility.call(that);
				}, 50, {
					maxWait: 200
				});
			}

			PositioningOperator.prototype = Object.create(OperatorBase.prototype);
			PositioningOperator.prototype.constructor = PositioningOperator;

			service.PositioningOperator = PositioningOperator;

			/**
			 * @ngdoc method
			 * @name onActivate
			 * @method
			 * @methodOf PositioningOperator
			 * @description Initializes 3D helper objects in the viewer.
			 */
			PositioningOperator.prototype.onActivate = function () {
				OperatorBase.prototype.onActivate.call(this);

				if (!this.state) {
					var boundingBox = modelViewerHoopsRuntimeDataService.getBoundingBox(this.viewer);
					var boundingCenter = boundingBox.center();
					var modelExtent = boundingBox.extents();
					this.state = {
						boundingBox: boundingBox,
						modelPadding: Math.max(modelExtent.x, modelExtent.y, modelExtent.z) / 10,
						axes: {
							x: boundingCenter.x,
							y: boundingCenter.y,
							z: boundingCenter.z
						},
						currentAxis: 'x'
					};
				}

				if (this.activationData) {
					_.assign(this.state.axes, this.activationData.pos);
				}

				this.objects = this.viewer.rib$positioningObjects;
				if (!this.objects) {
					this.viewer.rib$positioningObjects = this.objects = {};
				}

				let shapeId = modelViewerHoopsUtilitiesService.getMarkerShapeId();
				if (shapeId !== null) {
					this.markerShapeId = shapeId;
				} else {
					this.markerShapeId = modelViewerHoopsRuntimeDataService.getMarkerShapeIdDefault(this.viewer);
				}

				createHelperObjects.call(this);
			};

			/**
			 * @ngdoc method
			 * @name onDeactivate
			 * @method
			 * @methodOf PositioningOperator
			 * @description Finalizes some 3D helper objects in the viewer.
			 */
			PositioningOperator.prototype.onDeactivate = function () {
				cleanupHelperObjects.call(this);

				OperatorBase.prototype.onDeactivate.call(this);
			};

			/**
			 * @ngdoc method
			 * @name getPriority
			 * @method
			 * @methodOf PositioningOperator
			 * @description Gets the priority of the operator. In general, this will be `1` (the default value) for
			 *              navigation operators and `2` for manipulation operators.
			 * @returns {Number} The priority of the operator.
			 */
			PositioningOperator.prototype.getPriority = function () {
				return 2;
			};

			/**
			 * @ngdoc method
			 * @name computeInsertionPoint
			 * @method
			 * @methodOf PositioningOperator
			 * @description Computes the prospective insertion point in plane-before-distance mode.
			 */
			var computePlaneBeforeDistanceInsertionPoint = function () {
				var cam = this.viewer.view.getCamera();
				var camPos = cam.getPosition();
				var viewDir = Communicator.Point3.subtract(cam.getTarget(), camPos).normalize();
				var supportPt = Communicator.Point3.add(camPos, Communicator.Point3.scale(viewDir, this.currentPlaneData.distance));

				var upDir = cam.getUp();
				var sidewaysDir = Communicator.Point3.zero();
				Communicator.Matrix.createFromOffAxisRotation(viewDir, 90).transform(upDir, sidewaysDir);

				var helperPlane = Communicator.Plane.createFromPointAndNormal(Communicator.Point3.zero(), viewDir);
				upDir = modelViewerHoopsUtilitiesService.projectVectorToPlane(upDir, helperPlane).normalize();
				sidewaysDir = modelViewerHoopsUtilitiesService.projectVectorToPlane(sidewaysDir, helperPlane).normalize();

				return Communicator.Point3.add(supportPt, Communicator.Point3.add(upDir.scale(this.currentPlaneData.displacementY), sidewaysDir.scale(this.currentPlaneData.displacementX)));
			};

			/**
			 * @ngdoc method
			 * @name updateHelperObjectsVisibility
			 * @method
			 * @methodOf PositioningOperator
			 * @description Updates the visibility of helper objects depending on the operator mode.
			 */
			var updateHelperObjectsVisibility = function () {
				var viewer = this.viewer;
				var mdl = viewer.model;
				var objs = this.objects;

				var axisIds = [];
				['x', 'y', 'z'].forEach(function (axisName) {
					if (objs[axisName + 'AxisMeshInstanceId']) {
						axisIds.push(objs[axisName + 'AxisMeshInstanceId']);
					}
				});
				if (axisIds.length > 0) {
					mdl.setNodesVisibility(axisIds, this.mode === modes.axisIntersection);
				}

				let shapeId = this.markerShapeId;
				if (objs.ghostMeshInstanceIds && objs.ghostMeshInstanceIds[shapeId]) {
					var that = this;
					switch (this.mode) {
						case modes.anchor:
							if (this.currentAnchor) {
								(function () {
									var anchorPt = new Communicator.Point3(that.currentAnchor.x, that.currentAnchor.y, that.currentAnchor.z);
									var anchorLineDir = Communicator.Point3.subtract(getAnchorCameraEnd(that.viewer.view.getCamera()), anchorPt).normalize().scale(that.currentDeltaDepth);
									var ghostPt = Communicator.Point3.add(anchorPt, anchorLineDir);

									mdl.setNodeMatrix(objs.ghostMeshInstanceIds[shapeId], new Communicator.Matrix().setTranslationComponent(ghostPt.x, ghostPt.y, ghostPt.z));
									mdl.setNodesVisibility([objs.ghostMeshInstanceIds[shapeId]], true);
								})();
							} else {
								mdl.setNodesVisibility([objs.ghostMeshInstanceIds[shapeId]], false);
							}
							break;
						case modes.planeBeforeDistance:
							if (this.currentPlaneData) {
								(function () {
									var ghostPt = computePlaneBeforeDistanceInsertionPoint.call(that);

									mdl.setNodeMatrix(objs.ghostMeshInstanceIds[shapeId], new Communicator.Matrix().setTranslationComponent(ghostPt.x, ghostPt.y, ghostPt.z));
									mdl.setNodesVisibility([objs.ghostMeshInstanceIds[shapeId]], true);
								})();
							} else {
								mdl.setNodesVisibility([objs.ghostMeshInstanceIds[shapeId]], false);
							}
							break;
						default:
							mdl.setNodesVisibility([objs.ghostMeshInstanceIds[shapeId]], false);
							break;
					}
				}

				if (objs.anchorMeshInstanceIds) {
					if (this.mode === modes.anchor) {
						if (this.currentAnchor) {
							mdl.setNodeMatrix(objs.anchorMeshInstanceIds[shapeId], new Communicator.Matrix().setTranslationComponent(this.currentAnchor.x, this.currentAnchor.y, this.currentAnchor.z));
							mdl.setNodesVisibility([objs.anchorMeshInstanceIds[shapeId]], true);
						} else {
							mdl.setNodesVisibility([objs.anchorMeshInstanceIds[shapeId]], false);
						}
					} else {
						mdl.setNodesVisibility([objs.anchorMeshInstanceIds[shapeId]], false);
					}
				}
			};

			/**
			 * @ngdoc method
			 * @name updateAxisPositions
			 * @method
			 * @methodOf PositioningOperator
			 * @description Updates the positions of the axis helper objects based upon the current state.
			 */
			var updateAxisPositions = function () {
				var that = this;

				var viewer = this.viewer;
				var mdl = viewer.model;
				var objs = this.objects;

				['x', 'y', 'z'].forEach(function (axisName) {
					if (objs[axisName + 'AxisMeshInstanceId']) {
						mdl.setNodeMatrix(objs[axisName + 'AxisMeshInstanceId'], getAxisMatrix.call(that, axisName));
					}
				});
			};

			/**
			 * @ngdoc method
			 * @name updateAxisColors
			 * @method
			 * @methodOf PositioningOperator
			 * @description Updates the colors of axis helper objects based upon the current axis selection.
			 */
			var updateAxisColors = function () {
				var that = this;

				var viewer = this.viewer;
				var mdl = viewer.model;
				var objs = this.objects;

				['x', 'y', 'z'].forEach(function (axisName) {
					if (objs[axisName + 'AxisMeshInstanceId']) {
						mdl.setNodesFaceColor([objs[axisName + 'AxisMeshInstanceId']], getAxisColor.call(that, axisName));
					}
				});
			};

			/**
			 * @ngdoc method
			 * @name createHelperObjects
			 * @method
			 * @methodOf PositioningOperator
			 * @description Creates helper objects that indicate some hints about editing operations while the operator
			 *              is active.
			 */
			var createHelperObjects = function () {
				var that = this;

				function updateObjects() {
					updateHelperObjectsVisibility.call(that);
				}

				var viewer = this.viewer;
				var mdl = viewer.model;
				var objs = this.objects;

				if (!_.isNumber(objs.meshParentId)) {
					objs.meshParentId = mdl.createNode(modelViewerHoopsUtilitiesService.getHelperGeometryRoot(viewer));
				}

				var meshPromises = [];

				if (!objs.ghostMeshIds) {
					objs.ghostMeshIds = new Map();
					let markerShapeJsonList = modelViewerHoopsRuntimeDataService.getMarkerShapeList(viewer);
					_.each(markerShapeJsonList, function(shape){
						let shapeId = shape.Id;
						let shapeGeometry3d = JSON.parse(shape.ShapeDef);
						var md = new Communicator.MeshData();
						md.setBackfacesEnabled(false);
						md.setFaceWinding(Communicator.FaceWinding.CounterClockwise);
						md.addFaces(shapeGeometry3d.faces);
						md.addPolyline(shapeGeometry3d.lines);
						meshPromises.push((function () {
							return mdl.createMesh(md).then(function (id) {
								objs.ghostMeshIds[shapeId] = id;
							});
						})());
					});
				}

				(meshPromises.length > 0 ? $q.all(meshPromises): $q.when()).then(function () {
					var meshInstancePromises = [];

					if (!objs.ghostMeshInstanceIds) {
						objs.ghostMeshInstanceIds = new Map();
						_.each(objs.ghostMeshIds, function (ghostMeshId, ghostMeshkey) {
							meshInstancePromises.push((function () {
								var ghostMeshInstance = new Communicator.MeshInstanceData(ghostMeshId, undefined, undefined, undefined, undefined, undefined, Communicator.MeshInstanceCreationFlags.DoNotLight);
								ghostMeshInstance.setFaceColor(new Communicator.Color(255, 255, 0));
								ghostMeshInstance.setOpacity(0.5);
								return mdl.createMeshInstance(ghostMeshInstance, objs.meshParentId).then(function (id) {
									objs.ghostMeshInstanceIds[ghostMeshkey] = id;
									mdl.setNodesVisibility([id], false);
									mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotCut, [id], true);
									mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotExplode, [id], true);
									mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotSelect, [id], true);
								});
							})());
						});
					}

					if (!objs.anchorMeshInstanceIds) {
						objs.anchorMeshInstanceIds = new Map();
						_.each(objs.ghostMeshIds, function (ghostMeshId, ghostMeshkey) {
							meshInstancePromises.push((function () {
								var anchorMeshInstance = new Communicator.MeshInstanceData(ghostMeshId, undefined, undefined, undefined, undefined, undefined, Communicator.MeshInstanceCreationFlags.DoNotLight);
								anchorMeshInstance.setFaceColor(new Communicator.Color(0, 0, 0));
								anchorMeshInstance.setOpacity(0.7);
								return mdl.createMeshInstance(anchorMeshInstance, objs.meshParentId).then(function (id) {
									objs.anchorMeshInstanceIds[ghostMeshkey] = id;
									mdl.setNodesVisibility([id], false);
									mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotCut, [id], true);
									mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotExplode, [id], true);
									mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotSelect, [id], true);
								});
							})());
						});
					}

					if (meshInstancePromises.length > 0) {
						$q.all(meshInstancePromises).then(updateObjects);
					}
				});

				(function () {
					if (!objs.axisMeshId) {
						var md = new Communicator.MeshData();
						md.setBackfacesEnabled(false);

						var faces = modelViewerHoopsUtilitiesService.createCylinderFaces(0.1, [0, 1]);

						md.addFaces(modelViewerHoopsUtilitiesService.pointsToCoordArray(faces));
						md.setFaceWinding(Communicator.FaceWinding.CounterClockwise);

						return mdl.createMesh(md).then(function (id) {
							objs.axisMeshId = id;
						});
					} else {
						return $q.when(true);
					}
				})().then(function () {
					['x', 'y', 'z'].forEach(function (axisName) {
						if (!objs[axisName + 'AxisMeshInstanceId']) {
							var axisMeshInstance = new Communicator.MeshInstanceData(objs.axisMeshId);
							axisMeshInstance.setFaceColor(getAxisColor.call(that, axisName));
							axisMeshInstance.setMatrix(getAxisMatrix.call(that, axisName));
							mdl.createMeshInstance(axisMeshInstance, objs.meshParentId).then(function (id) {
								objs[axisName + 'AxisMeshInstanceId'] = id;
								mdl.setNodesVisibility([id], false);
								mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotCut, [id], true);
								mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotExplode, [id], true);
								mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotSelect, [id], true);
							}).then(updateObjects);
						}
					});
				});
			};

			/**
			 * @ngdoc method
			 * @name cleanupHelperObjects
			 * @method
			 * @methodOf PositioningOperator
			 * @description Removes helper objects created by {@see createHelperObjects}.
			 */
			var cleanupHelperObjects = function () {
				var viewer = this.viewer;
				var mdl = viewer.model;
				var objs = this.objects;

				var meshInstanceIds = [];
				['x', 'y', 'z'].forEach(function (axisName) {
					if (objs[axisName + 'AxisMeshInstanceId']) {
						meshInstanceIds.push(objs[axisName + 'AxisMeshInstanceId']);
						objs[axisName + 'AxisMeshInstanceId'] = null;
					}
				});

				if (objs.ghostMeshInstanceIds) {
					_.each(objs.ghostMeshInstanceIds, function(ghostMeshInstance, key) {
						meshInstanceIds.push(ghostMeshInstance);
					});
					objs.ghostMeshInstanceIds = null;
				}

				if (objs.anchorMeshInstanceIds) {
					_.each(objs.anchorMeshInstanceIds, function(anchorMeshInstance, key) {
						meshInstanceIds.push(anchorMeshInstance);
					});
					objs.anchorMeshInstanceIds = null;
				}

				if (meshInstanceIds.length > 0) {
					mdl.deleteMeshInstances(meshInstanceIds);
				}
			};

			/**
			 * @ngdoc method
			 * @name getAxisMatrix
			 * @method
			 * @methodOf PositioningOperator
			 * @description Computes the transformation matrix for a given axis helper object based upon the current
			 *              state.
			 * @param {String} axisName `x`, `y`, or `z`, to indicate the axis.
			 * @returns {Communicator.Matrix} The transformation matrix that can be applied to the mesh instance.
			 */
			var getAxisMatrix = function (axisName) {
				var axisLength;
				switch (axisName) {
					case 'x':
						axisLength = this.state.boundingBox.extents().x + 2 * this.state.modelPadding;
						return modelViewerHoopsUtilitiesService.createMatrix(
							Communicator.Matrix.createFromOffAxisRotation(new Communicator.Point3(0, 1, 0), 90),
							new Communicator.Matrix().setScaleComponent(axisLength, 1, 1),
							new Communicator.Matrix().setTranslationComponent(this.state.boundingBox.center().x - (axisLength / 2), this.state.axes.y, this.state.axes.z)
						);
					case 'y':
						axisLength = this.state.boundingBox.extents().y + 2 * this.state.modelPadding;
						return modelViewerHoopsUtilitiesService.createMatrix(
							Communicator.Matrix.createFromOffAxisRotation(new Communicator.Point3(1, 0, 0), -90),
							new Communicator.Matrix().setScaleComponent(1, axisLength, 1),
							new Communicator.Matrix().setTranslationComponent(this.state.axes.x, this.state.boundingBox.center().y - (axisLength / 2), this.state.axes.z)
						);
					case 'z':
						axisLength = this.state.boundingBox.extents().z + 2 * this.state.modelPadding;
						return modelViewerHoopsUtilitiesService.createMatrix(
							new Communicator.Matrix().setScaleComponent(1, 1, axisLength),
							new Communicator.Matrix().setTranslationComponent(this.state.axes.x, this.state.axes.y, this.state.boundingBox.center().z - (axisLength / 2))
						);
					default:
						throw new Error('Unsupported axis: ' + axisName);
				}
			};

			/**
			 * @ngdoc method
			 * @name getAxisColor
			 * @method
			 * @methodOf PositioningOperator
			 * @description Retrieves the color for a given axis helper object based upon the current axis selection.
			 * @param {String} axisName `x`, `y`, or `z`, to indicate the axis.
			 * @returns {Communicator.Color} The color.
			 */
			var getAxisColor = function (axisName) {
				return axisName === this.state.currentAxis ? defaultAxisColor : activeColor;
			};

			/**
			 * @ngdoc method
			 * @name onMouseDown
			 * @method
			 * @methodOf PositioningOperator
			 * @description Processes mouse button presses on the viewer.
			 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
			 */
			PositioningOperator.prototype.onMouseDown = function (event) {
				OperatorBase.prototype.onMouseDown.call(this, event);

				var that = this;
				switch (this.mode) {
					case modes.anchor:
						switch (event.getButton()) {
							case Communicator.Button.Left:
								(function () {
									var v = that.viewer;
									v.view.pickFromPoint(event.getPosition(), new Communicator.PickConfig()).then(function (selItem) {
										var cfg = new Communicator.PickConfig();
										cfg.selectionType = Communicator.SelectionType.Face;
										var isItemHit = selItem && (selItem.getSelectionType() !== Communicator.SelectionType.None) && (v.model.getSCInstanceKey(selItem.getNodeId(), 1)[0] >= 1);
										if (isItemHit) {
											var pos = selItem.getPosition();
											that.currentAnchor = {
												x: pos.x,
												y: pos.y,
												z: pos.z
											};
										} else {
											(function () {
												var cam = v.view.getCamera();
												var ray = v.view.raycastFromPoint(event.getPosition());

												var anchorPos = Communicator.Point3.add(cam.getPosition(), ray.direction.normalize().scale(20));
												that.currentAnchor = {
													x: anchorPos.x,
													y: anchorPos.y,
													z: anchorPos.z
												};
											})();
										}

										that.currentDeltaDepth = 0;

										updateHelperObjectsVisibility.call(that);
									});
									event.setHandled(true);
								})();
								break;
						}
						break;
					case modes.axisIntersection:
						switch (event.getButton()) {
							case Communicator.Button.Right:
								(function () {
									var v = that.viewer;
									v.view.pickFromPoint(event.getPosition(), new Communicator.PickConfig()).then(function (selItem) {
										var cfg = new Communicator.PickConfig();
										cfg.selectionType = Communicator.SelectionType.Face;
										var isItemHit = selItem && (selItem.getSelectionType() !== Communicator.SelectionType.None) && (v.model.getSCInstanceKey(selItem.getNodeId(), 1)[0] >= 1);
										if (isItemHit) {
											var pos = selItem.getPosition();
											_.assign(that.state.axes, pos);
										}

										updateAxisPositions.call(that);
									});
									event.setHandled(true);
								})();
								break;
						}
						break;
					case modes.planeBeforeDistance:
						switch (event.getButton()) {
							case Communicator.Button.Left:
								(function () {
									var v = that.viewer;
									v.view.pickFromPoint(event.getPosition(), new Communicator.PickConfig()).then(function (selItem) {
										var isItemHit = selItem && (selItem.getSelectionType() !== Communicator.SelectionType.None) && (v.model.getSCInstanceKey(selItem.getNodeId(), 1)[0] >= 1);
										if (isItemHit) {
											var pos = selItem.getPosition();

											var cam = v.view.getCamera();
											var camPos = cam.getPosition();
											var viewDir = Communicator.Point3.subtract(cam.getTarget(), camPos);
											var plane = Communicator.Plane.createFromPointAndNormal(pos, viewDir);

											var viewRay = new Communicator.Ray(camPos, viewDir);
											var camSupportPt = Communicator.Point3.zero();
											if (plane.intersectsRay(viewRay, camSupportPt)) {
												var upDir = cam.getUp();
												var sidewaysDir = Communicator.Point3.zero();
												Communicator.Matrix.createFromOffAxisRotation(viewDir, 90).transform(upDir, sidewaysDir);

												upDir = modelViewerHoopsUtilitiesService.projectVectorToPlane(upDir, plane).normalize();
												sidewaysDir = modelViewerHoopsUtilitiesService.projectVectorToPlane(sidewaysDir, plane).normalize();

												var displacement = modelViewerHoopsUtilitiesService.decomposeVector(Communicator.Point3.subtract(pos, camSupportPt), sidewaysDir, upDir);

												that.currentPlaneData = {
													distance: Communicator.Point3.subtract(v.view.getCamera().getPosition(), camSupportPt).length(),
													displacementX: displacement.x,
													displacementY: displacement.y
												};
											} else {
												that.currentPlaneData = null;
											}
										} else {
											that.currentPlaneData = null;
										}
									});
								})();
								break;
						}
						break;
				}
			};

			/**
			 * @ngdoc function
			 * @name isInterestingKey
			 * @function
			 * @methodOf PositioningOperator
			 * @description Determines whether a given key code is captured by the operator.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured.
			 */
			PositioningOperator.prototype.isInterestingKey = function (keyCode) {
				switch (this.mode) {
					case modes.axisIntersection:
						switch (keyCode) {
							case keyCodes.LEFT:
							case keyCodes.RIGHT:
							case keyCodes.UP:
							case keyCodes.DOWN:
							case keyCodes.ENTER:
							case keyCodes.ESCAPE:
								return true;
						}
						break;
					case modes.anchor:
						switch (keyCode) {
							case keyCodes.UP:
							case keyCodes.DOWN:
							case keyCodes.ENTER:
							case keyCodes.ESCAPE:
								return true;
						}
						break;
					case modes.planeBeforeDistance:
						switch (keyCode) {
							case keyCodes.LEFT:
							case keyCodes.RIGHT:
							case keyCodes.UP:
							case keyCodes.DOWN:
							case keyCodes.ENTER:
							case keyCodes.ESCAPE:
								return true;
						}
						break;
				}
				return OperatorBase.prototype.isInterestingKey.call(this, keyCode);
			};

			/**
			 * @ngdoc function
			 * @name isInterestingModifierKey
			 * @function
			 * @methodOf PositioningOperator
			 * @description Determines whether a given key code is captured by the operator and used as a modifier.
			 *              Subclasses may override this method to return a truth-y value for certain keys.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
			 */
			PositioningOperator.prototype.isInterestingModifierKey = function (keyCode) {
				switch (this.mode) {
					case modes.axisIntersection:
						switch (keyCode) {
							case keyCodes.SHIFT:
							case keyCodes.ALT:
								return true;
						}
						break;
					case modes.anchor:
						switch (keyCode) {
							case keyCodes.SHIFT:
								return true;
						}
						break;
					case modes.planeBeforeDistance:
						switch (keyCode) {
							case keyCodes.SHIFT:
							case keyCodes.ALT:
								return true;
						}
						break;
				}
				return OperatorBase.prototype.isInterestingModifierKey.call(this, keyCode);
			};

			/**
			 * @ngdoc method
			 * @name performAxisIntersectionUpdateStep
			 * @method
			 * @methodOf PositioningOperator
			 * @description Updates the state in axis intersection mode based on the current input.
			 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
			 */
			var performAxisIntersectionUpdateStep = function (delta) { // jshint ignore:line
				if (this.newKeyMap[keyCodes.ENTER]) {
					var camPos = this.viewer.view.getCamera().getPosition();
					firePositionPicked({
						x: this.state.axes.x,
						y: this.state.axes.y,
						z: this.state.axes.z
					}, {
						x: camPos.x,
						y: camPos.y,
						z: camPos.z
					});
					return;
				} else if (this.newKeyMap[keyCodes.ESCAPE]) {
					firePositionPicked();
					return;
				}

				if (this.keyMap[keyCodes.ALT]) {
					if (this.newKeyMap[keyCodes.RIGHT] || this.newKeyMap[keyCodes.DOWN]) {
						switch (this.state.currentAxis) {
							case 'x':
								this.state.currentAxis = 'y';
								break;
							case 'y':
								this.state.currentAxis = 'z';
								break;
							case 'z':
								this.state.currentAxis = 'x';
								break;
						}
						updateAxisColors.call(this);
					}
					if (this.newKeyMap[keyCodes.LEFT] || this.newKeyMap[keyCodes.UP]) {
						switch (this.state.currentAxis) {
							case 'x':
								this.state.currentAxis = 'z';
								break;
							case 'y':
								this.state.currentAxis = 'x';
								break;
							case 'z':
								this.state.currentAxis = 'y';
								break;
						}
						updateAxisColors.call(this);
					}
				} else {
					if (this.keyMap[keyCodes.UP]) {
						this.state.axes[this.state.currentAxis] += delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						if (this.state.axes[this.state.currentAxis] > this.state.boundingBox.max[this.state.currentAxis] + this.state.modelPadding) {
							this.state.axes[this.state.currentAxis] = this.state.boundingBox.max[this.state.currentAxis] + this.state.modelPadding;
						}
						updateAxisPositions.call(this);
					}
					if (this.keyMap[keyCodes.DOWN]) {
						this.state.axes[this.state.currentAxis] -= delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						if (this.state.axes[this.state.currentAxis] < this.state.boundingBox.min[this.state.currentAxis] - this.state.modelPadding) {
							this.state.axes[this.state.currentAxis] = this.state.boundingBox.min[this.state.currentAxis] - this.state.modelPadding;
						}
						updateAxisPositions.call(this);
					}
				}
			};

			/**
			 * @ngdoc method
			 * @name performAnchorUpdateStep
			 * @method
			 * @methodOf PositioningOperator
			 * @description Updates the state in anchor mode based on the current input.
			 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
			 */
			var performAnchorUpdateStep = function (delta) { // jshint ignore:line
				if (this.newKeyMap[keyCodes.ENTER]) {
					if (this.currentAnchor) {
						var cam = this.viewer.view.getCamera();
						var camPos = cam.getPosition();
						var anchorPt = new Communicator.Point3(this.currentAnchor.x, this.currentAnchor.y, this.currentAnchor.z);
						var anchorLineDir = Communicator.Point3.subtract(getAnchorCameraEnd(cam), anchorPt).normalize().scale(this.currentDeltaDepth);
						var resultingPt = Communicator.Point3.add(anchorPt, anchorLineDir);

						firePositionPicked({
							x: resultingPt.x,
							y: resultingPt.y,
							z: resultingPt.z
						}, {
							x: camPos.x,
							y: camPos.y,
							z: camPos.z
						});
					} else {
						firePositionPicked();
					}
					return;
				} else if (this.newKeyMap[keyCodes.ESCAPE]) {
					firePositionPicked();
					return;
				}

				if (this.keyMap[keyCodes.UP]) {
					this.currentDeltaDepth -= delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
				}
				if (this.keyMap[keyCodes.DOWN]) {
					this.currentDeltaDepth += delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
				}
			};

			/**
			 * @ngdoc method
			 * @name performPlaneBeforeDistanceUpdateStep
			 * @method
			 * @methodOf PositioningOperator
			 * @description Updates the state in plane-before-distance mode based on the current input.
			 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
			 */
			var performPlaneBeforeDistanceUpdateStep = function (delta) { // jshint ignore:line
				if (this.newKeyMap[keyCodes.ENTER]) {
					if (this.currentPlaneData) {
						var cam = this.viewer.view.getCamera();
						var camPos = cam.getPosition();

						var resultingPt = computePlaneBeforeDistanceInsertionPoint.call(this);

						firePositionPicked({
							x: resultingPt.x,
							y: resultingPt.y,
							z: resultingPt.z
						}, {
							x: camPos.x,
							y: camPos.y,
							z: camPos.z
						});
					} else {
						firePositionPicked();
					}
					return;
				} else if (this.newKeyMap[keyCodes.ESCAPE]) {
					firePositionPicked();
					return;
				}

				if (this.currentPlaneData) {
					if (this.keyMap[keyCodes.LEFT]) {
						if (this.keyMap[keyCodes.ALT]) {
							this.currentPlaneData.displacementX -= delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						}
					}
					if (this.keyMap[keyCodes.RIGHT]) {
						if (this.keyMap[keyCodes.ALT]) {
							this.currentPlaneData.displacementX += delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						}
					}
					if (this.keyMap[keyCodes.UP]) {
						if (this.keyMap[keyCodes.ALT]) {
							this.currentPlaneData.displacementY += delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						} else {
							this.currentPlaneData.distance -= delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						}
					}
					if (this.keyMap[keyCodes.DOWN]) {
						if (this.keyMap[keyCodes.ALT]) {
							this.currentPlaneData.displacementY -= delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						} else {
							this.currentPlaneData.distance += delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005);
						}
					}
				}
			};

			/**
			 * @ngdoc method
			 * @name performUpdateStep
			 * @method
			 * @methodOf PositioningOperator
			 * @description Updates the state based on the current input.
			 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
			 */
			PositioningOperator.prototype.performUpdateStep = function (delta) { // jshint ignore:line
				switch (this.mode) {
					case modes.axisIntersection:
						performAxisIntersectionUpdateStep.call(this, delta);
						break;
					case modes.anchor:
						performAnchorUpdateStep.call(this, delta);
						this.callUpdateHelperObjectsVisibility();
						break;
					case modes.planeBeforeDistance:
						performPlaneBeforeDistanceUpdateStep.call(this, delta);
						this.callUpdateHelperObjectsVisibility();
						break;
				}
			};

			/**
			 * @ngdoc method
			 * @name getContextTools
			 * @method
			 * @methodOf PositioningOperator
			 * @description Retrieves an array with toolbar button definitions to control the operator.
			 * @return {Array<Object>} The button definitions.
			 */
			PositioningOperator.prototype.getContextTools = function () {
				var that = this;

				function selectMode(id, btn) {
					that.currentAnchor = null;

					that.mode = btn.value;
					updateHelperObjectsVisibility.call(that);
					that.focusViewer();
				}

				return [{
					id: 'reset',
					type: 'sublist',
					caption: 'model.viewer.operator.position.modes.title',
					list: {
						cssClass: 'radio-group',
						activeValue: modes.anchor,
						items: [{
							id: 'anchorMode',
							type: 'radio',
							value: modes.anchor,
							caption: 'model.viewer.operator.position.modes.anchor',
							iconClass: 'tlb-icons ico-pos-fix',
							fn: selectMode
						}, {
							id: 'axisIntersection',
							type: 'radio',
							value: modes.axisIntersection,
							caption: 'model.viewer.operator.position.modes.axisIntersection',
							iconClass: 'tlb-icons ico-pos-intersect',
							fn: selectMode
						}, {
							id: 'planeBeforeDistance',
							type: 'radio',
							value: modes.planeBeforeDistance,
							caption: 'model.viewer.operator.position.modes.planeBeforeDistance',
							iconClass: 'tlb-icons ico-pos-multilevel',
							fn: selectMode
						}]
					}
				}, /*{
					id: 'save',
					type: 'item',
					caption: 'model.viewer.operator.position.save',
					iconClass: 'tlb-icons ico-save2',
					fn: function () {
						//save
					}
				}, */{
					id: 'exit',
					type: 'sublist',
					list: {
						items: [{
							id: 'cancel',
							type: 'item',
							caption: 'model.viewer.operator.position.cancelOperator',
							iconClass: 'control-red-icons ico-close',
							fn: function () {
								firePositionPicked();
							}
						}]
					}
				}].concat(OperatorBase.prototype.getContextTools());
			};

			// notification ----------------------------------------------------------------

			var onPositionPicked = new PlatformMessenger();

			/**
			 * @ngdoc method
			 * @name registerPositionPicked
			 * @method
			 * @methodOf modelViewerHoopsOperatorPositioningService
			 * @description Registers an event handler that is invoked when the position picking process has concluded.
			 * @param {Function} handler The event handler.
			 */
			service.registerPositionPicked = function (handler) {
				onPositionPicked.register(handler);
			};

			/**
			 * @ngdoc method
			 * @name unregisterPositionPicked
			 * @method
			 * @methodOf modelViewerHoopsOperatorPositioningService
			 * @description Unregisters an event handler registered with {@see registerPositionPicked}.
			 * @param {Function} handler The event handler.
			 */
			service.unregisterPositionPicked = function (handler) {
				onPositionPicked.unregister(handler);
			};

			/**
			 * @ngdoc method
			 * @name firePositionPicked
			 * @method
			 * @methodOf modelViewerHoopsOperatorPositioningService
			 * @description Fires event handlers when the position picking operation has concluded. If no values are
			 *              passed to the parameters, the event indicates that the operation was cancelled and no
			 *              position was selected.
			 * @param {Object} pos The selected position, if any position was selected. If supplied, this must be an
			 *                     object with the properties `x`, `y`, and `z`.
			 * @param {Object} campos The camera position, if any position was selected. If supplied, this must be an
			 *                        object with the properties `x`, `y`, and `z`.
			 */
			function firePositionPicked(pos, campos) {
				if (pos && campos) {
					onPositionPicked.fire({
						pos: pos,
						campos: campos
					});
				} else {
					onPositionPicked.fire();
				}
			}

			return service;
		}]);
})(angular);
