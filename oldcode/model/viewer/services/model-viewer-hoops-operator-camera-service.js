/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsOperatorCameraService
	 * @function
	 *
	 * @description Provides [custom camera operators](http://rib-tst-cloud01/preview2/documentation/build/viewer-web-client-custom-operators.html)
	 *              for the Hoops 3D Viewer. The service provides names of the operators, as well as factory
	 *              functions for instantiating the operators for a given viewer with a given viewer settings object.
	 *              Optionally, the constructor functions also accept a method for focusing the viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsOperatorCameraService', ['keyCodes', 'Communicator',
		'modelViewerHoopsOperatorUtilitiesService', 'modelViewerHoopsUtilitiesService', 'modelViewerInputHelpService', 'modelViewerHoopsLinkService', 'modelViewerHoopsRuntimeDataService',
		function (keyCodes, Communicator, modelViewerHoopsOperatorUtilitiesService, modelViewerHoopsUtilitiesService,
		          modelViewerInputHelpService) {
			var maxDegrees = 89.5;

			var service = {};
			var getViewDirection = modelViewerHoopsOperatorUtilitiesService.getViewDirection;
			var translateCameraTo = modelViewerHoopsOperatorUtilitiesService.translateCameraTo;
			var createMatrix = modelViewerHoopsUtilitiesService.createMatrix;

			/**
			 * @ngdoc function
			 * @name getUpDownDirection
			 * @function
			 * @methodOf modelViewerHoopsOperatorCameraService
			 * @description Computes a vertical direction perpendicular to the gaze direction.
			 * @param {Communicator.Point3} viewDirection The gaze direction.
			 * @param {Communicator.Point3} upDirection The direction that matches *above* from the observer's point of
			 *                                          view.
			 * @returns {Communicator.Point3} The normalized vector pointing upwards from the camera viewing direction.
			 */
			function getUpDownDirection(viewDirection, upDirection) {
				var viewPlane = Communicator.Plane.createFromPointAndNormal(Communicator.Point3.zero(), viewDirection);
				var result = Communicator.Point3.zero();
				if (viewPlane.intersectsRay(new Communicator.Ray(upDirection, viewDirection), result) || viewPlane.intersectsRay(new Communicator.Ray(upDirection, viewDirection.copy().negate()), result)) {
					return result.normalize();
				} else {
					throw new Error('No intersection point found.');
				}
			}

			/**
			 * @ngdoc function
			 * @name createYawMatrix
			 * @function
			 * @methodOf modelViewerHoopsOperatorCameraService
			 * @description Creates a transformation matrix for yawing points (rotating around the Z axis).
			 * @param {Number} degrees The relative yaw angle in degrees.
			 * @returns {Communicator.Matrix} The rotation matrix.
			 */
			function createYawMatrix(degrees) {
				var radians = degrees / 180 * Math.PI;
				return Communicator.Matrix.createFromOffAxisRotation(new Communicator.Point3(0, 0, 1), radians);
			}

			/**
			 * @ngdoc function
			 * @name createPitchMatrix
			 * @function
			 * @methodOf modelViewerHoopsOperatorCameraService
			 * @description Creates a transformation matrix for pitching points (rotating around the horizontal axis
			 *              perpendicular to the *forward* direction).
			 * @param {Communicator.Point3} viewDirection The direction matching *forward* for the object being rotated.
			 * @param {Communicator.Point3} upDirection The direction matching *above* for the object being rotated.
			 * @param {Number} degrees The relative pitch angle in degrees.
			 * @returns {Communicator.Matrix} The rotation matrix.
			 */
			function createPitchMatrix(viewDirection, upDirection, degrees) {
				var radians = degrees / 180 * Math.PI;
				var rotAxis = getSidewaysDirection(viewDirection, upDirection);
				return Communicator.Matrix.createFromOffAxisRotation(rotAxis, radians);
			}

			var OperatorBase = modelViewerHoopsOperatorUtilitiesService.OperatorBase;

			/**
			 * @ngdoc method
			 * @name KeyboardWalkOperator
			 * @constructor
			 * @methodOf KeyboardWalkOperator
			 * @description Initializes a new instance.
			 * @param {Communicator.Viewer} viewer The viewer.
			 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
			 *                                operators linked to it.
			 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
			 */
			function KeyboardWalkOperator(viewer, viewerSettings, focusViewer) {
				OperatorBase.call(this, viewer, viewerSettings, focusViewer);
				this.walkByMouse = false;
				this.panButton = Communicator.Button.Middle;
			}

			KeyboardWalkOperator.prototype = Object.create(OperatorBase.prototype);
			KeyboardWalkOperator.prototype.constructor = KeyboardWalkOperator;

			/**
			 * @ngdoc function
			 * @name isInterestingKey
			 * @function
			 * @methodOf KeyboardWalkOperator
			 * @description Determines whether a given key code is captured by the operator.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured.
			 */
			KeyboardWalkOperator.prototype.isInterestingKey = function (keyCode) {
				switch (keyCode) {
					case keyCodes.LEFT:
					case keyCodes.RIGHT:
					case keyCodes.UP:
					case keyCodes.DOWN:
					case keyCodes.PAGE_UP:
					case keyCodes.PAGE_DOWN:
						return true;
					default:
						return OperatorBase.prototype.isInterestingKey.call(this, keyCode);
				}
			};

			/**
			 * @ngdoc function
			 * @name isInterestingModifierKey
			 * @function
			 * @methodOf KeyboardWalkOperator
			 * @description Determines whether a given key code is captured by the operator and used as a modifier.
			 *              Subclasses may override this method to return a truth-y value for certain keys.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
			 */
			KeyboardWalkOperator.prototype.isInterestingModifierKey = function (keyCode) {
				switch (keyCode) {
					case keyCodes.ALT:
					case keyCodes.SHIFT:
					case keyCodes.CTRL:
						return true;
					default:
						return OperatorBase.prototype.isInterestingModifierKey.call(this, keyCode);
				}
			};

			/**
			 * @ngdoc method
			 * @name performUpdateStep
			 * @method
			 * @methodOf KeyboardWalkOperator
			 * @description Updates the position of the camera based upon current input.
			 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
			 */
			KeyboardWalkOperator.prototype.performUpdateStep = function (delta) { // jshint ignore:line
				function moveAhead(viewDirection, delta) {
					var movement = viewDirection.copy();
					movement.z = 0;
					movement.normalize();
					movement.scale(delta);
					return movement;
				}

				function moveSideways(viewDirection, upDirection, delta) {
					var movement = getSidewaysDirection(viewDirection, upDirection);
					movement.scale(delta);
					return movement;
				}

				var view = this.viewer.view;
				var camera = view.getCamera();
				var viewDirection = getViewDirection(camera);

				var currentMovement = Communicator.Point3.zero();
				var currentYawDegrees = 0;
				var currentPitchDegrees = 0;

				var isCameraModified = false;

				// determine requested movement components in this step
				if (this.keyMap[keyCodes.UP]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.add(new Communicator.Point3(0, 0, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
					} else {
						if (Boolean(this.keyMap[keyCodes.ALT]) !== Boolean(this.walkByMouse)) {
							currentPitchDegrees += this.keyMap[keyCodes.SHIFT] ? 30 : 10;
						} else {
							currentMovement.add(moveAhead(viewDirection, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
						}
					}
					isCameraModified = true;
				} else if (this.keyMap[keyCodes.DOWN]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.subtract(new Communicator.Point3(0, 0, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
					} else {
						if (Boolean(this.keyMap[keyCodes.ALT]) !== Boolean(this.walkByMouse)) {
							currentPitchDegrees -= this.keyMap[keyCodes.SHIFT] ? 30 : 10;
						} else {
							currentMovement.subtract(moveAhead(viewDirection, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
						}
					}
					isCameraModified = true;
				}
				if (this.keyMap[keyCodes.LEFT]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.subtract(moveSideways(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 2 : 0.3));
					} else {
						currentYawDegrees += this.keyMap[keyCodes.SHIFT] ? 40 : 12;
					}
					isCameraModified = true;
				} else if (this.keyMap[keyCodes.RIGHT]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.add(moveSideways(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 2 : 0.3));
					} else {
						currentYawDegrees -= this.keyMap[keyCodes.SHIFT] ? 40 : 12;
					}
					isCameraModified = true;
				}
				if (OperatorBase.prototype.addKeyboardZoom.call(this, delta, viewDirection, currentMovement)) {
					isCameraModified = true;
				}

				var deltaClickPos;
				if (this.currentMousePos) {
					if (this.clickPosMap[Communicator.Button.Left]) {
						deltaClickPos = this.currentMousePos.copy();
						deltaClickPos.subtract(this.clickPosMap[Communicator.Button.Left]);
						deltaClickPos = modelViewerHoopsOperatorUtilitiesService.preprocessMouseInput(deltaClickPos);

						if (deltaClickPos.x) {
							currentYawDegrees -= deltaClickPos.x / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
							isCameraModified = true;
						}
						if (deltaClickPos.y) {
							if (this.walkByMouse) {
								currentMovement.subtract(moveAhead(viewDirection, deltaClickPos.y / (this.keyMap[keyCodes.SHIFT] ? 20 : 60)));
							} else {
								currentPitchDegrees -= deltaClickPos.y / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
							}
							isCameraModified = true;
						}
					}
				}
				// Handling Touch Logic
				var that = this;
				var touches = this.touchState.getAll();
				var geoInfo = modelViewerHoopsOperatorUtilitiesService.getGeneralGeometryInfo(this.viewer);
				var deltaTouch;
				if (touches.length > 0) {
					switch (touches.length) {
						case 1:

							deltaTouch = touches[0].getDisplacement();
							if (deltaTouch.x) {
								currentYawDegrees -= deltaTouch.x / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
								isCameraModified = true;
							}
							if (deltaTouch.y) {
								if (this.walkByMouse) {
									currentMovement.subtract(moveAhead(viewDirection, deltaTouch.y / (this.keyMap[keyCodes.SHIFT] ? 20 : 60)));
								} else {
									currentPitchDegrees -= deltaTouch.y / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
								}
								isCameraModified = true;
							}
							break;
						case 2:
							(function () {
								var deltaDist = that.touchState.pinchDistance ? that.touchState.pinchDistance.current - that.touchState.pinchDistance.previous : 0;
								var displacement = modelViewerHoopsUtilitiesService.getCenter2(touches[0].getDisplacement(), touches[1].getDisplacement());

								var zoomSize = Math.abs(deltaDist);
								var panSize = Math.max(Math.abs(displacement.x), Math.abs(displacement.y));

								if (zoomSize > panSize * 1.1) {
									modelViewerHoopsOperatorUtilitiesService.walkOperatorZoom(that.viewer, deltaDist, geoInfo);
									isCameraModified = true;
								}
								if (panSize > zoomSize * 1.1) {
									modelViewerHoopsOperatorUtilitiesService.pan(that.viewer, displacement, geoInfo);
									isCameraModified = true;
								}
							})();
							break;
					}

				}
				var pos, trg;
				if (touches.length !== 2) {

					// compute complete movement
					currentMovement.scale(delta / 100);
					currentPitchDegrees *= delta / 10;
					currentYawDegrees *= delta / 10;

					// override movement with mouse panning, if required
					if (this.currentMousePos) {
						if (OperatorBase.prototype.processMousePan.call(this, viewDirection, currentMovement)) {
							isCameraModified = true;
						}
					}

					pos = camera.getPosition();
					trg = camera.getTarget();

					pos.add(currentMovement);
					trg.add(currentMovement);

					if (currentPitchDegrees || currentYawDegrees) {
						var matrices = [];
						matrices.push(new Communicator.Matrix().setTranslationComponent(-pos.x, -pos.y, -pos.z));

						if (currentYawDegrees) {
							matrices.push(createYawMatrix(currentYawDegrees));
						}
						if (currentPitchDegrees) {
							var normalizedVD = viewDirection.copy();
							normalizedVD.normalize();

							var horizontalVD = viewDirection.copy();
							horizontalVD.z = 0;
							horizontalVD.normalize();

							var angle = Math.acos(Communicator.Point3.dot(normalizedVD, horizontalVD)) * 180 / Math.PI;
							if ((viewDirection.z > 0) && (currentPitchDegrees > 0)) {
								if (angle + currentPitchDegrees > maxDegrees) {
									currentPitchDegrees = maxDegrees - angle;
								}
							} else if ((viewDirection.z < 0) && (currentPitchDegrees < 0)) {
								if (angle - currentPitchDegrees > maxDegrees) {
									currentPitchDegrees = angle - maxDegrees;
								}
							}

							matrices.push(createPitchMatrix(viewDirection, camera.getUp(), currentPitchDegrees));
						}

						matrices.push(new Communicator.Matrix().setTranslationComponent(pos.x, pos.y, pos.z));

						var matrix = createMatrix.apply(this, matrices);
						matrix.transform(trg, trg);
					}
				}

				if (isCameraModified) {
					// apply computed movement
					if (touches.length === 2) {
						camera.setPosition(geoInfo.camPos);
						camera.setTarget(geoInfo.camTarget);
						camera.setUp(new Communicator.Point3(0, 0, 1));
						view.updateCamera(camera);
					} else {

						camera.setPosition(pos);
						camera.setTarget(trg);

						if (currentYawDegrees) {
							camera.setUp(new Communicator.Point3(0, 0, 1));
						}
						view.updateCamera(camera);

					}
				}

			};

			/**
			 * @ngdoc function
			 * @name isDraggingMouseButton
			 * @function
			 * @methodOf KeyboardWalkOperator
			 * @description Determines whether pressing a given mouse button indicates the start of a dragging
			 *              operation, hence the current position should be stored.
			 * @param {Communicator.Button} button The button to check.
			 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
			 */
			KeyboardWalkOperator.prototype.isDraggingMouseButton = function (button) {
				switch (button) {
					case Communicator.Button.Left:
					case Communicator.Button.Middle:
						return true;
					default:
						return false;
				}
			};

			/**
			 * @ngdoc method
			 * @name onMouseDown
			 * @method
			 * @methodOf KeyboardWalkOperator
			 * @description Processes mouse button presses on the viewer.
			 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
			 */
			KeyboardWalkOperator.prototype.onMouseDown = function (event) {
				function moveOnFloor(view, settings, clickPos) {
					var eyeHeight = 1.7;

					var camera = view.getCamera();

					var pos = camera.getPosition();
					pos.z -= eyeHeight;
					var floor = Communicator.Plane.createFromPointAndNormal(pos, new Communicator.Point3(0, 0, 1));

					var viewRay = view.raycastFromPoint(clickPos);

					var intersection = Communicator.Point3.zero();
					if (floor.intersectsRay(viewRay, intersection)) {
						intersection.z += eyeHeight;
						translateCameraTo(camera, intersection);
						view.setCamera(camera, settings.transitions ? 500 : 0);
					}
				}

				OperatorBase.prototype.onMouseDown.call(this, event);

				switch (event.getButton()) {
					case Communicator.Button.Left:
						if (this.keyMap[keyCodes.CTRL]) {
							moveOnFloor(this.viewer.view, this.viewerSettings, event.getPosition());
						}
						break;
					case Communicator.Button.Right:
						this.selectFromPoint(event.getPosition(), this.keyMap[keyCodes.SHIFT], this.keyMap[keyCodes.ALT]);
						event.setHandled(true);
						break;
				}
			};

			/**
			 * @ngdoc method
			 * @name getInputFeatures
			 * @method
			 * @methodOf KeyboardWalkOperator
			 * @description Retrieves an array of input features for which a help text is provided.
			 * @return {Array<InputFeature>} The input features.
			 */
			KeyboardWalkOperator.prototype.getInputFeatures = function () {
				var result = OperatorBase.prototype.getInputFeatures.call(this);
				if (this.walkByMouse) {
					result.push(new modelViewerInputHelpService.InputFeature(50, 'model.viewer.inputHelp.features.horizontalForwardBackward', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
						]),
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
						], [keyCodes.ALT])
					]));
				} else {
					result.push(new modelViewerInputHelpService.InputFeature(50, 'model.viewer.inputHelp.features.horizontalForwardBackward', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
						])
					]));
				}
				if (!this.walkByMouse) {
					result.push(new modelViewerInputHelpService.InputFeature(48, 'model.viewer.inputHelp.features.turnLeftRight', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
						])
					]));
					result.push(new modelViewerInputHelpService.InputFeature(46, 'model.viewer.inputHelp.features.turnUpDown', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
						], [keyCodes.ALT])
					]));
				}
				result.push(new modelViewerInputHelpService.InputFeature(44, 'model.viewer.inputHelp.features.moveSidewaysAllDirections', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.KeyAction(keyCodes.UP),
						new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
						new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
						new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
					], [keyCodes.CTRL])
				]));
				if (this.walkByMouse) {
					result.push(new modelViewerInputHelpService.InputFeature(42, 'model.viewer.inputHelp.features.turnGazeDirection', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL)
						])
					]));
				} else {
					result.push(new modelViewerInputHelpService.InputFeature(42, 'model.viewer.inputHelp.features.turnGazeDirection', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
						])
					]));
				}
				result.push(new modelViewerInputHelpService.InputFeature(40, 'model.viewer.inputHelp.features.pan', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.HORIZONTAL),
						new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.VERTICAL)
					])
				]));
				result.push(new modelViewerInputHelpService.InputFeature(38, 'model.viewer.inputHelp.features.accelerate', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.ModifierKeyAction(keyCodes.SHIFT)
					])
				]));
				result.push(new modelViewerInputHelpService.InputFeature(36, 'model.viewer.inputHelp.features.moveToLocation', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.MouseButtonClickAction(modelViewerInputHelpService.mouseButtons.LEFT)
					], [keyCodes.CTRL])
				]));
				result.push(new modelViewerInputHelpService.InputFeature(30, 'model.viewer.inputHelp.features.select', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.MouseButtonClickAction(modelViewerInputHelpService.mouseButtons.RIGHT)
					])
				]));
				return result;
			};

			/**
			 * @ngdoc method
			 * @name SelectionAwareTurntableOperator
			 * @constructor
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Initializes a new instance.
			 * @param {Communicator.Viewer} viewer The viewer.
			 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
			 *                                operators linked to it.
			 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
			 */
			function SelectionAwareTurntableOperator(viewer, viewerSettings, focusViewer) {
				OperatorBase.call(this, viewer, viewerSettings, focusViewer);

				this.allowVerticalRotation = false;
				this.setFocusOnPanning(false);
			}

			SelectionAwareTurntableOperator.prototype = Object.create(OperatorBase.prototype);
			SelectionAwareTurntableOperator.prototype.constructor = SelectionAwareTurntableOperator;

			service.SelectionAwareTurntableOperator = SelectionAwareTurntableOperator;

			/**
			 * @ngdoc function
			 * @name setFocusOnPanning
			 * @function
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Sets the `focusOnPanning` property that determines whether the operator should focus on
			 *              panning rather than on rotating.
			 * @param {Boolean} value The new value for the property.
			 */
			SelectionAwareTurntableOperator.prototype.setFocusOnPanning = function (value) {
				this.focusOnPanning = value;
				this.panButton = this.focusOnPanning ? Communicator.Button.Left : Communicator.Button.Middle;
			};

			/**
			 * @ngdoc function
			 * @name isInterestingKey
			 * @function
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Determines whether a given key code is captured by the operator.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured.
			 */
			SelectionAwareTurntableOperator.prototype.isInterestingKey = function (keyCode) {
				switch (keyCode) {
					case keyCodes.LEFT:
					case keyCodes.RIGHT:
					case keyCodes.UP:
					case keyCodes.DOWN:
					case keyCodes.PAGE_UP:
					case keyCodes.PAGE_DOWN:
						return true;
					default:
						return OperatorBase.prototype.isInterestingKey.call(this, keyCode);
				}
			};

			/**
			 * @ngdoc function
			 * @name isInterestingModifierKey
			 * @function
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Determines whether a given key code is captured by the operator and used as a modifier.
			 *              Subclasses may override this method to return a truth-y value for certain keys.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
			 */
			SelectionAwareTurntableOperator.prototype.isInterestingModifierKey = function (keyCode) {
				switch (keyCode) {
					case keyCodes.ALT:
					case keyCodes.SHIFT:
					case keyCodes.CTRL:
						return true;
					default:
						return OperatorBase.prototype.isInterestingModifierKey.call(this, keyCode);
				}
			};

			/**
			 * @ngdoc function
			 * @name isDraggingMouseButton
			 * @function
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Determines whether pressing a given mouse button indicates the start of a dragging
			 *              operation, hence the current position should be stored.
			 * @param {Communicator.Button} button The button to check.
			 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
			 */
			SelectionAwareTurntableOperator.prototype.isDraggingMouseButton = function (button) {
				switch (button) {
					case Communicator.Button.Left:
					case Communicator.Button.Middle:
						return true;
					default:
						return false;
				}
			};

			/**
			 * @ngdoc method
			 * @name onMouseDown
			 * @method
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Processes mouse button presses on the viewer.
			 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
			 */
			SelectionAwareTurntableOperator.prototype.onMouseDown = function (event) {
				OperatorBase.prototype.onMouseDown.call(this, event);

				switch (event.getButton()) {
					case Communicator.Button.Right:
						this.selectFromPoint(event.getPosition(), this.keyMap[keyCodes.SHIFT], this.keyMap[keyCodes.ALT]);
						event.setHandled(true);
						break;
				}
			};

			/**
			 * @ngdoc method
			 * @name performUpdateStep
			 * @method
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Updates the position of the camera based upon current input.
			 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
			 */
			SelectionAwareTurntableOperator.prototype.performUpdateStep = function (delta) { // jshint ignore:line
				function moveSideways(viewDirection, upDirection, delta) {
					var movement = getSidewaysDirection(viewDirection, upDirection);
					movement.scale(delta);
					return movement;
				}

				function moveUpDown(viewDirection, upDirection, delta) {
					var movement = getUpDownDirection(viewDirection, upDirection);
					movement.scale(delta);
					return movement;
				}

				var view = this.viewer.view;
				var camera = view.getCamera();
				var viewDirection = getViewDirection(camera);
				var up = new Communicator.Point3(0, 0, 1);

				var currentMovement = Communicator.Point3.zero();
				var currentTurnDegrees = 0;
				var currentVTurnDegrees = 0;
				var currentPitchDegrees = 0;

				var isCameraModified = false;

				// determine requested movement components in this step
				if (this.keyMap[keyCodes.LEFT]) {
					if (this.focusOnPanning ? !this.keyMap[keyCodes.ALT] : this.keyMap[keyCodes.CTRL]) {
						currentMovement.add(moveSideways(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 5 : 1.8));
					} else if (!this.focusOnPanning || this.keyMap[keyCodes.ALT]) {
						currentTurnDegrees += this.keyMap[keyCodes.SHIFT] ? 4 : 1;
					}
					isCameraModified = true;
				} else if (this.keyMap[keyCodes.RIGHT]) {
					if (this.focusOnPanning ? !this.keyMap[keyCodes.ALT] : this.keyMap[keyCodes.CTRL]) {
						currentMovement.subtract(moveSideways(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 5 : 1.8));
					} else if (!this.focusOnPanning || this.keyMap[keyCodes.ALT]) {
						currentTurnDegrees -= this.keyMap[keyCodes.SHIFT] ? 4 : 1;
					}
					isCameraModified = true;
				}

				if (this.keyMap[keyCodes.UP]) {
					if (this.focusOnPanning ? !this.keyMap[keyCodes.ALT] : this.keyMap[keyCodes.CTRL]) {
						if (this.allowVerticalRotation) {
							currentMovement.add(moveUpDown(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 5 : 1.8));
						} else {
							currentMovement.add(new Communicator.Point3(0, 0, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
						}
					} else if (!this.focusOnPanning || this.keyMap[keyCodes.ALT]) {
						if (this.allowVerticalRotation) {
							currentVTurnDegrees -= this.keyMap[keyCodes.SHIFT] ? 4 : 1;
						} else {
							currentPitchDegrees += this.keyMap[keyCodes.SHIFT] ? 30 : 10;
						}
					}
					isCameraModified = true;
				} else if (this.keyMap[keyCodes.DOWN]) {
					if (this.focusOnPanning ? !this.keyMap[keyCodes.ALT] : this.keyMap[keyCodes.CTRL]) {
						if (this.allowVerticalRotation) {
							currentMovement.subtract(moveUpDown(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 5 : 1.8));
						} else {
							currentMovement.subtract(new Communicator.Point3(0, 0, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
						}
					} else if (!this.focusOnPanning || this.keyMap[keyCodes.ALT]) {
						if (this.allowVerticalRotation) {
							currentVTurnDegrees += this.keyMap[keyCodes.SHIFT] ? 4 : 1;
						} else {
							currentPitchDegrees -= this.keyMap[keyCodes.SHIFT] ? 30 : 10;
						}
					}
					isCameraModified = true;
				}
				if (OperatorBase.prototype.addKeyboardZoom.call(this, delta, viewDirection, currentMovement)) {
					isCameraModified = true;
				}

				var deltaClickPos;
				if (this.currentMousePos) {
					if (this.clickPosMap[this.focusOnPanning ? Communicator.Button.Middle : Communicator.Button.Left]) {
						deltaClickPos = this.currentMousePos.copy();
						deltaClickPos.subtract(this.clickPosMap[this.focusOnPanning ? Communicator.Button.Middle : Communicator.Button.Left]);
						deltaClickPos = modelViewerHoopsOperatorUtilitiesService.preprocessMouseInput(deltaClickPos);

						if (deltaClickPos.x) {
							currentTurnDegrees -= deltaClickPos.x / (this.keyMap[keyCodes.SHIFT] ? 25 : 70);
							isCameraModified = true;
						}
						if (deltaClickPos.y) {
							if (this.allowVerticalRotation) {
								currentVTurnDegrees -= deltaClickPos.y / (this.keyMap[keyCodes.SHIFT] ? 25 : 70);
							} else {
								currentPitchDegrees -= deltaClickPos.y / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
							}
							isCameraModified = true;
						}
					}
				}

				//Handling Touch
				var that = this;
				var touches = this.touchState.getAll();
				var geoInfo = modelViewerHoopsOperatorUtilitiesService.getGeneralGeometryInfo(this.viewer);

				var pos = camera.getPosition();
				var trg = camera.getTarget();
				var deltaTouch;
				if (touches.length > 0) {

					switch (touches.length) {
						case 1:
							// compute complete movement
							deltaTouch = touches[0].getDisplacement();

							if (deltaTouch.x) {
								currentTurnDegrees -= deltaTouch.x / (this.keyMap[keyCodes.SHIFT] ? 25 : 70);
								isCameraModified = true;
							}
							if (deltaTouch.y) {
								if (this.allowVerticalRotation) {
									currentVTurnDegrees -= deltaTouch.y / (this.keyMap[keyCodes.SHIFT] ? 25 : 70);
								} else {
									currentPitchDegrees -= deltaTouch.y / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
								}
								isCameraModified = true;
							}
							break;
						case 2:
							(function () {
								delta = that.touchState.pinchDistance ? that.touchState.pinchDistance.current - that.touchState.pinchDistance.previous : 0;
								var displacement = modelViewerHoopsUtilitiesService.getCenter2(touches[0].getDisplacement(), touches[1].getDisplacement());

								var zoomSize = Math.abs(delta);
								var panSize = Math.max(Math.abs(displacement.x), Math.abs(displacement.y));

								if (zoomSize > panSize * 1.1) {
									modelViewerHoopsOperatorUtilitiesService.turnableOperatorZoom(that.viewer, delta, geoInfo);
									isCameraModified = true;
								}
								if (panSize > zoomSize * 1.1) {
									modelViewerHoopsOperatorUtilitiesService.pan(that.viewer, displacement, geoInfo);
									isCameraModified = true;
								}
							})();
							break;
					}
				}


				if (touches.length !== 2) {
					// compute complete movement
					currentMovement.scale(delta / 100);
					currentTurnDegrees *= delta / 15;
					currentVTurnDegrees *= delta / 15;
					currentPitchDegrees *= delta / 10;

					// override movement with mouse panning, if required
					if (this.currentMousePos) {
						if (OperatorBase.prototype.processMousePan.call(this, viewDirection, currentMovement)) {
							isCameraModified = true;
						}
					}

					pos = camera.getPosition();
					trg = camera.getTarget();

					pos.add(currentMovement);
					trg.add(currentMovement);

					if (currentTurnDegrees || currentVTurnDegrees || currentPitchDegrees) {
						var matrices = [];

						var angle;
						if (currentVTurnDegrees || currentPitchDegrees) {
							var normalizedVD = viewDirection.copy();
							normalizedVD.normalize();

							var horizontalVD = viewDirection.copy();
							horizontalVD.z = 0;
							horizontalVD.normalize();

							angle = Math.acos(Communicator.Point3.dot(normalizedVD, horizontalVD)) * 180 / Math.PI;
						}

						if (this.refPoint && (currentTurnDegrees || currentVTurnDegrees)) {
							var refPoint = this.refPoint;
							matrices.push(new Communicator.Matrix().setTranslationComponent(-refPoint.x, -refPoint.y, -refPoint.z));
							if (currentTurnDegrees) {
								matrices.push(Communicator.Matrix.createFromOffAxisRotation(up, currentTurnDegrees));
							}
							if (currentVTurnDegrees) {
								/* jshint -W073 */ // nested too deeply
								if ((viewDirection.z > 0) && (currentVTurnDegrees > 0)) {
									if (angle + currentVTurnDegrees > maxDegrees) {
										currentVTurnDegrees = maxDegrees - angle;
									}
								} else if ((viewDirection.z < 0) && (currentVTurnDegrees < 0)) {
									if (angle - currentVTurnDegrees > maxDegrees) {
										currentVTurnDegrees = angle - maxDegrees;
									}
								}
								/* jshint +W073 */

								matrices.push(Communicator.Matrix.createFromOffAxisRotation(getSidewaysDirection(viewDirection, up), currentVTurnDegrees));
							}
							matrices.push(new Communicator.Matrix().setTranslationComponent(refPoint.x, refPoint.y, refPoint.z));
						}
						if (currentPitchDegrees) {
							if ((viewDirection.z > 0) && (currentPitchDegrees > 0)) {
								if (angle + currentPitchDegrees > maxDegrees) {
									currentPitchDegrees = maxDegrees - angle;
								}
							} else if ((viewDirection.z < 0) && (currentPitchDegrees < 0)) {
								if (angle - currentPitchDegrees > maxDegrees) {
									currentPitchDegrees = angle - maxDegrees;
								}
							}

							matrices.push(new Communicator.Matrix().setTranslationComponent(-pos.x, -pos.y, -pos.z));
							matrices.push(createPitchMatrix(viewDirection, camera.getUp(), currentPitchDegrees));
							matrices.push(new Communicator.Matrix().setTranslationComponent(pos.x, pos.y, pos.z));
						}

						var matrix = createMatrix.apply(this, matrices);
						matrix.transform(pos, pos);
						matrix.transform(trg, trg);
					}
				}

				if (isCameraModified) {
					if (touches.length === 2) {
						camera.setPosition(geoInfo.camPos);
						camera.setTarget(geoInfo.camTarget);
						camera.setUp(new Communicator.Point3(0, 0, 1));
						view.updateCamera(camera);
					} else {

						camera.setPosition(pos);
						camera.setTarget(trg);
						camera.setUp(up);
						view.updateCamera(camera);

					}


				}

			};

			/**
			 * @ngdoc method
			 * @name getInputFeatures
			 * @method
			 * @methodOf SelectionAwareTurntableOperator
			 * @description Retrieves an array of input features for which a help text is provided.
			 * @return {Array<InputFeature>} The input features.
			 */
			SelectionAwareTurntableOperator.prototype.getInputFeatures = function () {
				var result = OperatorBase.prototype.getInputFeatures.call(this);
				if (this.focusOnPanning) {
					result.push(new modelViewerInputHelpService.InputFeature(50, 'model.viewer.inputHelp.features.pan', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT),
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
						])
					]));
					result.push(new modelViewerInputHelpService.InputFeature(46, 'model.viewer.inputHelp.features.rotateAround', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT),
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
						], [keyCodes.ALT]),
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.HORIZONTAL),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.VERTICAL)
						])
					]));
				} else if (this.allowVerticalRotation) {
					result.push(new modelViewerInputHelpService.InputFeature(50, 'model.viewer.inputHelp.features.rotateAround', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT),
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
						])
					]));
				} else {
					result.push(new modelViewerInputHelpService.InputFeature(50, 'model.viewer.inputHelp.features.rotateAround', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL)
						])
					]));
					result.push(new modelViewerInputHelpService.InputFeature(49, 'model.viewer.inputHelp.features.turnUpDown', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
						])
					]));
				}
				if (!this.focusOnPanning) {
					if (this.allowVerticalRotation) {
						result.push(new modelViewerInputHelpService.InputFeature(48, 'model.viewer.inputHelp.features.pan', [
							new modelViewerInputHelpService.InputComboSet([
								new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
								new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT),
								new modelViewerInputHelpService.KeyAction(keyCodes.UP),
								new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
							], [keyCodes.CTRL]),
							new modelViewerInputHelpService.InputComboSet([
								new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.HORIZONTAL),
								new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.VERTICAL)
							])
						]));
					} else {
						result.push(new modelViewerInputHelpService.InputFeature(48, 'model.viewer.inputHelp.features.pan', [
							new modelViewerInputHelpService.InputComboSet([
								new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
								new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
							], [keyCodes.CTRL]),
							new modelViewerInputHelpService.InputComboSet([
								new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.HORIZONTAL),
								new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.VERTICAL)
							])
						]));
						result.push(new modelViewerInputHelpService.InputFeature(46, 'model.viewer.inputHelp.features.moveUpDown', [
							new modelViewerInputHelpService.InputComboSet([
								new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
								new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
							], [keyCodes.CTRL])
						]));
					}
				}
				result.push(new modelViewerInputHelpService.InputFeature(38, 'model.viewer.inputHelp.features.accelerate', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.ModifierKeyAction(keyCodes.SHIFT)
					])
				]));
				result.push(new modelViewerInputHelpService.InputFeature(30, 'model.viewer.inputHelp.features.select', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.MouseButtonClickAction(modelViewerInputHelpService.mouseButtons.RIGHT)
					])
				]));
				return result;
			};


			/**
			 * @ngdoc function
			 * @name getSidewaysDirection
			 * @function
			 * @methodOf modelViewerHoopsOperatorCameraService
			 * @description Computes a horizontal direction perpendicular to the gaze direction.
			 * @param {Communicator.Point3} viewDirection The gaze direction.
			 * @param {Communicator.Point3} upDirection The direction that matches *above* from the observer's point of
			 *                                          view.
			 * @returns {Communicator.Point3} The normalized vector pointing sideways from the camera viewing direction.
			 */
			function getSidewaysDirection(viewDirection, upDirection) {
				var viewPlane = Communicator.Plane.createFromPointAndNormal(Communicator.Point3.zero(), viewDirection);
				var result = Communicator.Point3.zero();
				if (viewPlane.intersectsRay(new Communicator.Ray(upDirection, viewDirection), result) || viewPlane.intersectsRay(new Communicator.Ray(upDirection, viewDirection.copy().negate()), result)) {
					var rotMatrix = Communicator.Matrix.createFromOffAxisRotation(viewDirection, 90);
					rotMatrix.transform(result, result);
					return result.normalize();
				} else {
					throw new Error('No intersection point found.');
				}
			}

			/**
			 * @ngdoc method
			 * @name KeyboardFlyOperator
			 * @constructor
			 * @methodOf KeyboardFlyOperator
			 * @description Initializes a new instance.
			 * @param {Communicator.Viewer} viewer The viewer.
			 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
			 *                                operators linked to it.
			 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
			 */
			function KeyboardFlyOperator(viewer, viewerSettings, focusViewer) {
				OperatorBase.call(this, viewer, viewerSettings, focusViewer);
				this.flyByMouse = false;
				this.panButton = Communicator.Button.Middle;
			}

			KeyboardFlyOperator.prototype = Object.create(OperatorBase.prototype);
			KeyboardFlyOperator.prototype.constructor = KeyboardFlyOperator;

			/**
			 * @ngdoc function
			 * @name isInterestingKey
			 * @function
			 * @methodOf KeyboardFlyOperator
			 * @description Determines whether a given key code is captured by the operator.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured.
			 */
			KeyboardFlyOperator.prototype.isInterestingKey = function (keyCode) {
				switch (keyCode) {
					case keyCodes.LEFT:
					case keyCodes.RIGHT:
					case keyCodes.UP:
					case keyCodes.DOWN:
					case keyCodes.PAGE_UP:
					case keyCodes.PAGE_DOWN:
						return true;
					default:
						return OperatorBase.prototype.isInterestingKey.call(this, keyCode);
				}
			};

			/**
			 * @ngdoc function
			 * @name isInterestingModifierKey
			 * @function
			 * @methodOf KeyboardFlyOperator
			 * @description Determines whether a given key code is captured by the operator and used as a modifier.
			 *              Subclasses may override this method to return a truth-y value for certain keys.
			 * @param {Number} keyCode The key code to examine.
			 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
			 */
			KeyboardFlyOperator.prototype.isInterestingModifierKey = function (keyCode) {
				switch (keyCode) {
					case keyCodes.ALT:
					case keyCodes.SHIFT:
					case keyCodes.CTRL:
						return true;
					default:
						return OperatorBase.prototype.isInterestingModifierKey.call(this, keyCode);
				}
			};

			/**
			 * @ngdoc method
			 * @name performUpdateStep
			 * @method
			 * @methodOf KeyboardFlyOperator
			 * @description Updates the position of the camera based upon current input.
			 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
			 */
			KeyboardFlyOperator.prototype.performUpdateStep = function (delta) { // jshint ignore:line
				var that = this;

				function moveAhead(viewDirection, delta) {
					var movement = viewDirection.copy();
					movement.normalize();
					movement.scale(delta);
					return movement;
				}

				function moveSideways(viewDirection, upDirection, delta) {
					var movement = getSidewaysDirection(viewDirection, upDirection);
					movement.scale(delta);
					return movement;
				}

				function moveVertically(viewDirection, upDirection, delta) {
					var movement = getUpDownDirection(viewDirection, upDirection);
					movement.scale(delta);
					return movement;
				}

				var view = this.viewer.view;
				var camera = view.getCamera();
				var viewDirection = getViewDirection(camera);

				var currentMovement = Communicator.Point3.zero();
				var currentYawDegrees = 0;
				var currentPitchDegrees = 0;

				var isCameraModified = false;

				// determine requested movement components in this step
				if (this.keyMap[keyCodes.UP]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.add(moveVertically(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
					} else {
						if (Boolean(this.keyMap[keyCodes.ALT]) !== Boolean(this.flyByMouse)) {
							currentPitchDegrees += this.keyMap[keyCodes.SHIFT] ? 30 : 10;
						} else {
							currentMovement.add(moveAhead(viewDirection, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
						}
					}
					isCameraModified = true;
				} else if (this.keyMap[keyCodes.DOWN]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.subtract(moveVertically(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
					} else {
						if (Boolean(this.keyMap[keyCodes.ALT]) !== Boolean(this.flyByMouse)) {
							currentPitchDegrees -= this.keyMap[keyCodes.SHIFT] ? 30 : 10;
						} else {
							currentMovement.subtract(moveAhead(viewDirection, this.keyMap[keyCodes.SHIFT] ? 4 : 0.5));
						}
					}
					isCameraModified = true;
				}
				if (this.keyMap[keyCodes.LEFT]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.subtract(moveSideways(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 2 : 0.3));
					} else {
						currentYawDegrees += this.keyMap[keyCodes.SHIFT] ? 40 : 12;
					}
					isCameraModified = true;
				} else if (this.keyMap[keyCodes.RIGHT]) {
					if (this.keyMap[keyCodes.CTRL]) {
						currentMovement.add(moveSideways(viewDirection, camera.getUp(), this.keyMap[keyCodes.SHIFT] ? 2 : 0.3));
					} else {
						currentYawDegrees -= this.keyMap[keyCodes.SHIFT] ? 40 : 12;
					}
					isCameraModified = true;
				}
				if (OperatorBase.prototype.addKeyboardZoom.call(this, delta, viewDirection, currentMovement)) {
					isCameraModified = true;
				}

				var deltaClickPos;
				if (this.currentMousePos) {
					if (this.clickPosMap[Communicator.Button.Middle]) {
						deltaClickPos = this.currentMousePos.copy();
						deltaClickPos.subtract(this.clickPosMap[Communicator.Button.Middle]);
						deltaClickPos = modelViewerHoopsOperatorUtilitiesService.preprocessMouseInput(deltaClickPos);

						if (deltaClickPos.x) {
							currentMovement.add(moveSideways(viewDirection, camera.getUp(), deltaClickPos.x / (this.keyMap[keyCodes.SHIFT] ? 25 : 55)));
							isCameraModified = true;
						}
						if (deltaClickPos.y) {
							currentMovement.subtract(moveVertically(viewDirection, camera.getUp(), deltaClickPos.y / (this.keyMap[keyCodes.SHIFT] ? 25 : 55)));
							isCameraModified = true;
						}
					} else if (this.clickPosMap[Communicator.Button.Left]) {
						deltaClickPos = this.currentMousePos.copy();
						deltaClickPos.subtract(this.clickPosMap[Communicator.Button.Left]);
						deltaClickPos = modelViewerHoopsOperatorUtilitiesService.preprocessMouseInput(deltaClickPos);

						if (deltaClickPos.x) {
							currentYawDegrees -= deltaClickPos.x / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
							isCameraModified = true;
						}
						if (deltaClickPos.y) {
							if (this.flyByMouse) {
								currentMovement.subtract(moveAhead(viewDirection, deltaClickPos.y / (this.keyMap[keyCodes.SHIFT] ? 20 : 60)));
							} else {
								currentPitchDegrees -= deltaClickPos.y / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
							}
							isCameraModified = true;
						}
					}
				}
				//Handling Touch
				var touches = this.touchState.getAll();
				var geoInfo = modelViewerHoopsOperatorUtilitiesService.getGeneralGeometryInfo(this.viewer);

				var pos = camera.getPosition();
				var trg = camera.getTarget();
				var deltaTouch;
				if (touches.length > 0) {

					switch (touches.length) {
						case 1:
							deltaTouch = touches[0].getDisplacement();

							if (deltaTouch.x) {
								currentYawDegrees -= deltaTouch.x / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
								isCameraModified = true;
							}
							if (deltaTouch.y) {
								if (this.flyByMouse) {
									currentMovement.subtract(moveAhead(viewDirection, deltaTouch.y / (this.keyMap[keyCodes.SHIFT] ? 20 : 60)));
								} else {
									currentPitchDegrees -= deltaTouch.y / (this.keyMap[keyCodes.SHIFT] ? 15 : 45);
								}
								isCameraModified = true;
							}
							break;
						case 2:
							(function () {
								var deltaDist = that.touchState.pinchDistance ? that.touchState.pinchDistance.current - that.touchState.pinchDistance.previous : 0;
								var displacement = modelViewerHoopsUtilitiesService.getCenter2(touches[0].getDisplacement(), touches[1].getDisplacement());

								var zoomSize = Math.abs(deltaDist);
								var panSize = Math.max(Math.abs(displacement.x), Math.abs(displacement.y));

								if (zoomSize > panSize * 1.1) {
									modelViewerHoopsOperatorUtilitiesService.turnableOperatorZoom(that.viewer, deltaDist, geoInfo);
									isCameraModified = true;
								}
								if (panSize > zoomSize * 1.1) {
									modelViewerHoopsOperatorUtilitiesService.pan(that.viewer, displacement, geoInfo);
									isCameraModified = true;
								}
							})();
							break;
					}
				}
				if (touches.length !== 2) {

					// compute complete movement
					currentMovement.scale(delta / 100);
					currentPitchDegrees *= delta / 10;
					currentYawDegrees *= delta / 10;

					// override movement with mouse panning, if required
					if (this.currentMousePos) {
						if (OperatorBase.prototype.processMousePan.call(this, viewDirection, currentMovement)) {
							isCameraModified = true;
						}
					}
					pos.add(currentMovement);
					trg.add(currentMovement);

					if (currentPitchDegrees || currentYawDegrees) {
						var matrices = [];
						matrices.push(new Communicator.Matrix().setTranslationComponent(-pos.x, -pos.y, -pos.z));

						if (currentYawDegrees) {
							matrices.push(createYawMatrix(currentYawDegrees));
						}
						if (currentPitchDegrees) {
							var normalizedVD = viewDirection.copy();
							normalizedVD.normalize();

							var horizontalVD = viewDirection.copy();
							horizontalVD.z = 0;
							horizontalVD.normalize();

							var angle = Math.acos(Communicator.Point3.dot(normalizedVD, horizontalVD)) * 180 / Math.PI;
							if ((viewDirection.z > 0) && (currentPitchDegrees > 0)) {
								if (angle + currentPitchDegrees > maxDegrees) {
									currentPitchDegrees = maxDegrees - angle;
								}
							} else if ((viewDirection.z < 0) && (currentPitchDegrees < 0)) {
								if (angle - currentPitchDegrees > maxDegrees) {
									currentPitchDegrees = angle - maxDegrees;
								}
							}

							matrices.push(createPitchMatrix(viewDirection, camera.getUp(), currentPitchDegrees));
						}

						matrices.push(new Communicator.Matrix().setTranslationComponent(pos.x, pos.y, pos.z));

						var matrix = createMatrix.apply(this, matrices);
						matrix.transform(trg, trg);
					}

				}


				if (isCameraModified) {
					// apply computed movement
					if (touches.length === 2) {

						camera.setPosition(geoInfo.camPos);
						camera.setTarget(geoInfo.camTarget);
						camera.setUp(new Communicator.Point3(0, 0, 1));
						view.updateCamera(camera);
					} else {

						// apply computed movement
						camera.setPosition(pos);
						camera.setTarget(trg);
						if (currentYawDegrees) {
							camera.setUp(new Communicator.Point3(0, 0, 1));
						}
						view.updateCamera(camera);

					}


				}
			};

			/**
			 * @ngdoc function
			 * @name isDraggingMouseButton
			 * @function
			 * @methodOf KeyboardFlyOperator
			 * @description Determines whether pressing a given mouse button indicates the start of a dragging
			 *              operation, hence the current position should be stored.
			 * @param {Communicator.Button} button The button to check.
			 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
			 */
			KeyboardFlyOperator.prototype.isDraggingMouseButton = function (button) {
				switch (button) {
					case Communicator.Button.Left:
					case Communicator.Button.Middle:
						return true;
					default:
						return false;
				}
			};

			/**
			 * @ngdoc method
			 * @name onMouseDown
			 * @method
			 * @methodOf KeyboardFlyOperator
			 * @description Processes mouse button presses on the viewer.
			 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
			 */
			KeyboardFlyOperator.prototype.onMouseDown = function (event) {
				OperatorBase.prototype.onMouseDown.call(this, event);

				switch (event.getButton()) {
					case Communicator.Button.Right:
						this.selectFromPoint(event.getPosition(), this.keyMap[keyCodes.SHIFT], this.keyMap[keyCodes.ALT]);
						event.setHandled(true);
						break;
				}
			};

			/**
			 * @ngdoc method
			 * @name getInputFeatures
			 * @method
			 * @methodOf KeyboardFlyOperator
			 * @description Retrieves an array of input features for which a help text is provided.
			 * @return {Array<InputFeature>} The input features.
			 */
			KeyboardFlyOperator.prototype.getInputFeatures = function () {
				var result = OperatorBase.prototype.getInputFeatures.call(this);
				if (this.flyByMouse) {
					result.push(new modelViewerInputHelpService.InputFeature(50, 'model.viewer.inputHelp.features.flyForwardBackward', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
						]),
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
						], [keyCodes.ALT])
					]));
				} else {
					result.push(new modelViewerInputHelpService.InputFeature(50, 'model.viewer.inputHelp.features.flyForwardBackward', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
						])
					]));
				}
				if (!this.flyByMouse) {
					result.push(new modelViewerInputHelpService.InputFeature(48, 'model.viewer.inputHelp.features.turnLeftRight', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
						])
					]));
					result.push(new modelViewerInputHelpService.InputFeature(46, 'model.viewer.inputHelp.features.turnUpDown', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
						], [keyCodes.ALT])
					]));
				}
				result.push(new modelViewerInputHelpService.InputFeature(44, 'model.viewer.inputHelp.features.moveSidewaysAllDirections', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.KeyAction(keyCodes.UP),
						new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
						new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
						new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
					], [keyCodes.CTRL])
				]));
				if (this.flyByMouse) {
					result.push(new modelViewerInputHelpService.InputFeature(42, 'model.viewer.inputHelp.features.turnGazeDirection', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.KeyAction(keyCodes.UP),
							new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
							new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
							new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL)
						])
					]));
				} else {
					result.push(new modelViewerInputHelpService.InputFeature(42, 'model.viewer.inputHelp.features.turnGazeDirection', [
						new modelViewerInputHelpService.InputComboSet([
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL),
							new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
						])
					]));
				}
				result.push(new modelViewerInputHelpService.InputFeature(40, 'model.viewer.inputHelp.features.pan', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.HORIZONTAL),
						new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.MIDDLE, modelViewerInputHelpService.dragDirection.VERTICAL)
					])
				]));
				result.push(new modelViewerInputHelpService.InputFeature(38, 'model.viewer.inputHelp.features.accelerate', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.ModifierKeyAction(keyCodes.SHIFT)
					])
				]));
				result.push(new modelViewerInputHelpService.InputFeature(30, 'model.viewer.inputHelp.features.select', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.MouseButtonClickAction(modelViewerInputHelpService.mouseButtons.RIGHT)
					])
				]));
				return result;
			};

			service.operatorNames = ['keyboardWalkOperator', 'mouseWalkOperator', 'turntableOperator', 'orbitOperator', 'keyboardFlyOperator', 'mouseFlyOperator', 'panOperator'];
			service.operators = {
				keyboardWalkOperator: function (viewer, viewerSettings, focusViewer) {
					return new KeyboardWalkOperator(viewer, viewerSettings, focusViewer);
				},
				mouseWalkOperator: function (viewer, viewerSettings, focusViewer) {
					var result = new KeyboardWalkOperator(viewer, viewerSettings, focusViewer);
					result.walkByMouse = true;
					return result;
				},
				turntableOperator: function (viewer, viewerSettings, focusViewer) {
					return new SelectionAwareTurntableOperator(viewer, viewerSettings, focusViewer);
				},
				orbitOperator: function (viewer, viewerSettings, focusViewer) {
					var result = new SelectionAwareTurntableOperator(viewer, viewerSettings, focusViewer);
					result.allowVerticalRotation = true;
					return result;
				},
				keyboardFlyOperator: function (viewer, viewerSettings, focusViewer) {
					return new KeyboardFlyOperator(viewer, viewerSettings, focusViewer);
				},
				mouseFlyOperator: function (viewer, viewerSettings, focusViewer) {
					var result = new KeyboardFlyOperator(viewer, viewerSettings, focusViewer);
					result.flyByMouse = true;
					return result;
				},
				panOperator: function (viewer, viewerSettings, focusViewer) {
					var result = new SelectionAwareTurntableOperator(viewer, viewerSettings, focusViewer);
					result.allowVerticalRotation = true;
					result.setFocusOnPanning(true);
					return result;
				}
			};
			service.scsMenuDescriptors = [{
				optionId: 'pan',
				operatorId: 'pan',
				isBuiltIn: false,
				icon: 'view-pan'
			}, {
				optionId: 'turntable',
				operatorId: 'turntable',
				isBuiltIn: false,
				icon: 'view-turntable'
			}, {
				optionId: 'orbit',
				operatorId: 'orbit',
				isBuiltIn: false,
				icon: 'view-orbit'
			}];

			service.menuDescriptors = [{
				optionId: 'pan',
				operatorId: 'pan',
				isBuiltIn: false,
				icon: 'view-pan'
			}, {
				optionId: 'turntable',
				operatorId: 'turntable',
				isBuiltIn: false,
				icon: 'view-turntable'
			}, {
				optionId: 'orbit',
				operatorId: 'orbit',
				isBuiltIn: false,
				icon: 'view-orbit'
			}, {
				optionId: 'kbdWalk',
				operatorId: 'keyboardWalk',
				isBuiltIn: false,
				icon: 'view-walk-keyboard'
			}, {
				optionId: 'mouseWalk',
				operatorId: 'mouseWalk',
				isBuiltIn: false,
				icon: 'view-walk-mouse'
			}, {
				optionId: 'kbdFly',
				operatorId: 'keyboardFly',
				isBuiltIn: false,
				icon: 'view-fly-keyboard'
			}, {
				optionId: 'mouseFly',
				operatorId: 'mouseFly',
				isBuiltIn: false,
				icon: 'view-fly-mouse'
			}];

			return service;
		}]);
})(angular);
