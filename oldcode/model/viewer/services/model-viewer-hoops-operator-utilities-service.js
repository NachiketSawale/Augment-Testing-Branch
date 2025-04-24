/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsOperatorUtilitiesService
	 * @function
	 *
	 * @description Provides [custom camera operators](http://rib-tst-cloud01/preview2/documentation/build/viewer-web-client-custom-operators.html)
	 *              for the Hoops 3D Viewer. The service provides names of the operators, as well as factory
	 *              functions for instantiating the operators for a given viewer with a given viewer settings object.
	 *              Optionally, the constructor functions also accept a method for focusing the viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsOperatorUtilitiesService',
		modelViewerHoopsOperatorUtilitiesService);

	modelViewerHoopsOperatorUtilitiesService.$inject = ['_', 'keyCodes', 'Communicator',
		'modelViewerShortcutService', 'modelViewerInputHelpService', 'PlatformMessenger',
		'modelViewerObjectTreeService', 'modelViewerObjectSelectionService',
		'modelViewerHoopsTouchService', 'modelViewerHoopsLinkService',
		'modelViewerHoopsUtilitiesService', 'modelViewerHoopsRuntimeDataService'];

	function modelViewerHoopsOperatorUtilitiesService(_, keyCodes, Communicator,
		modelViewerShortcutService, modelViewerInputHelpService, PlatformMessenger,
		modelViewerObjectTreeService, modelViewerObjectSelectionService,
		modelViewerHoopsTouchService, modelViewerHoopsLinkService,
		modelViewerHoopsUtilitiesService, modelViewerHoopsRuntimeDataService) {

		const service = {};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name getViewDirection
		 * @function
		 * @methodOf modelViewerHoopsOperatorUtilitiesService
		 * @description Computes the gaze direction vector of a given camera.
		 * @param {Communicator.Camera} camera The camera.
		 * @returns {Communicator.Point3} The non-normalized vector pointing in the gaze direction of the camera.
		 */
		service.getViewDirection = function () {
			return modelViewerHoopsUtilitiesService.getViewDirection.apply(this, arguments);
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name translateCameraTo
		 * @function
		 * @methodOf modelViewerHoopsOperatorUtilitiesService
		 * @description Moves the camera to a new position while maintaining the perspective.
		 * @param {Communicator.Camera} camera The camera to move.
		 * @param {Communicator.Point3} newPosition The new position of the camera.
		 */
		service.translateCameraTo = function (camera, newPosition) {
			const delta = newPosition.copy();
			delta.subtract(camera.getPosition());
			camera.setPosition(newPosition);
			camera.setTarget(camera.getTarget().add(delta));
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name zoomIn
		 * @function
		 * @methodOf modelViewerHoopsOperatorUtilitiesService
		 * @description Zooms a viewer in.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Number} zoomDelta The relative zoom level.
		 * @param {Communicator.Point2} viewportCoords Optionally, a point in the viewport to zoom in on. If no
		 *                                             value is provided for this parameter, the camera will zoom
		 *                                             in on the center of the viewport.
		 */
		service.zoomIn = function (viewer, zoomDelta, viewportCoords) {
			const view = viewer.view;
			const camera = view.getCamera();

			if (camera._projection === Communicator.Projection.Orthographic) {

				view.setProjectionMode(Communicator.Projection.Perspective);

				let cameraPos = camera.getPosition();
				let targetPos = camera.getTarget();
				let viewDir = service.getViewDirection(camera);
				const viewLen = viewDir.length();
				const newLen = viewLen - zoomDelta;
				if (newLen > 0) {
					const factor = newLen / viewLen;

					viewDir.scale(factor);
					cameraPos = targetPos.subtract(viewDir);
					camera.setPosition(cameraPos);
				}
				view.updateCamera(camera);

				view.setProjectionMode(Communicator.Projection.Orthographic);
				view.updateCamera(camera);
			} else {
				let viewDir = service.getViewDirection(camera);
				viewDir.normalize().scale(zoomDelta);

				let targetPos = camera.getPosition();
				targetPos.add(viewDir);

				if (viewportCoords) {
					const targetPlane = Communicator.Plane.createFromPointAndNormal(targetPos, viewDir);
					const targetRay = view.raycastFromPoint(viewportCoords);
					targetPlane.intersectsRay(targetRay, targetPos);
				}
				service.translateCameraTo(camera, targetPos);
				view.updateCamera(camera);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name zoomOut
		 * @function
		 * @methodOf modelViewerHoopsOperatorUtilitiesService
		 * @description Zooms a viewer out.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Number} zoomDelta The relative zoom level.
		 * @param {Communicator.Point2} viewportCoords Optionally, a point in the viewport to zoom out from. If no
		 *                                             value is provided for this parameter, the camera will zoom
		 *                                             out from the center of the viewport.
		 */
		service.zoomOut = function (viewer, zoomDelta, viewportCoords) {
			const view = viewer.view;
			const camera = view.getCamera();

			if (camera._projection === Communicator.Projection.Orthographic) {

				view.setProjectionMode(Communicator.Projection.Perspective);

				let targetPos = camera.getTarget();
				let viewDir = service.getViewDirection(camera);
				const viewLen = viewDir.length();
				const newLen = viewLen + zoomDelta;
				const factor = newLen / viewLen;

				viewDir.scale(factor);
				const cameraPos = targetPos.subtract(viewDir);
				camera.setPosition(cameraPos);
				view.updateCamera(camera);

				view.setProjectionMode(Communicator.Projection.Orthographic);
				view.updateCamera(camera);
			} else { // perspective

				let viewDir = service.getViewDirection(camera);
				viewDir.normalize().scale(zoomDelta);

				let targetPos = camera.getPosition();
				targetPos.subtract(viewDir);

				if (viewportCoords) {
					const planeBasePoint = camera.getPosition().add(viewDir);

					const targetPlane = Communicator.Plane.createFromPointAndNormal(planeBasePoint, viewDir);
					const targetRay = view.raycastFromPoint(viewportCoords);
					if (targetPlane.intersectsRay(targetRay, targetPos)) {
						viewDir = targetPos.copy().subtract(camera.getPosition());
						targetPos.subtract(viewDir).subtract(viewDir);
					}
				}

				service.translateCameraTo(camera, targetPos);
				view.updateCamera(camera);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name retrieveSelectionBounds
		 * @method
		 * @methodOf modelViewerHoopsOperatorUtilitiesService
		 * @description Retrieves the bounding box of the current selection.
		 * @param {Communicator.WebViewer} viewer The viewer whose selection to examine.
		 * @returns {Promise<Box>} The bounding box of the current selection, or the bounding box of the entire
		 *                         model if the current selection is empty.
		 */
		function retrieveSelectionBounds(viewer) {
			const model = viewer.model;

			const selItems = viewer.selectionManager.getResults();
			if (selItems && (selItems.length > 0)) {
				let selectionBounds = null;
				const selectedPartIds = [];
				selItems.forEach(function (selItem) {
					selectedPartIds.push(selItem.getNodeId());
				});
				if (selectedPartIds.length > 0) {
					return model.getNodesBounding(selectedPartIds).then(function (box) {
						if (selectionBounds) {
							selectionBounds.addBox(box);
						} else {
							selectionBounds = box;
						}

						return selectionBounds;
					});
				} else {
					return new Promise(function (resolve) {
						resolve(selectionBounds);
					});
				}
			} else {
				return model.getModelBounding();
			}
		}

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name preprocessMouseInput
		 * @function
		 * @methodOf modelViewerHoopsOperatorUtilitiesService
		 * @description Modifies a {Communicator.Point2} object that indicates two-dimensional displacement such as
		 *              that of a mouse cursor. The horizontal and vertical delta values are modified in such a way
		 *              that small values will become even smaller and very small values will be replaced with zero.
		 *              Like this, a small displacement allows for a more precisely controlled effect.
		 * @param {Communicator.Point2} delta The two-dimensional displacement.
		 * @returns {Communicator.Point2} The preprocessed displacement.
		 */
		service.preprocessMouseInput = function (delta) {
			function preprocessAxis(axisDelta) {
				let result = Math.abs(axisDelta);
				if (result < 10) {
					return 0;
				} else {
					if (result < 50) {
						const x = (result - 10) / 40;
						result = x * x * 20;
					} else {
						result -= 30;
					}
					if (axisDelta < 0) {
						result = -result;
					}
					return result;
				}
			}

			return new Communicator.Point2(preprocessAxis(delta.x), preprocessAxis(delta.y));
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name OperatorBase
		 * @constructor
		 * @methodOf OperatorBase
		 * @description Initializes a new instance.
		 * @param {Communicator.Viewer} viewer The viewer.
		 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
		 *                                operators linked to it.
		 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
		 */
		function OperatorBase(viewer, viewerSettings, focusViewer) {
			this.viewer = viewer;
			this.viewerSettings = viewerSettings || {};
			this.focusViewer = focusViewer;
			this.currentMousePos = null;
			this.previousMousePos = null;
			this.timerId = null;
			this.previousTimestamp = 0;
			this.keyMap = {};
			this.newKeyMap = {};
			this.clickPosMap = {};
			this.refPoint = null;

			this.touchState = new TouchState();

			const that = this;
			this.viewerCallbacks = {
				selection: function () {
					that.updateRefPoint();
				}
			};
		}

		service.OperatorBase = OperatorBase;

		/**
		 * @ngdoc method
		 * @name needsSelection
		 * @method
		 * @methodOf OperatorBase
		 * @description TODO: This method is required for unknown reasons. It is invoked by HOOPS Communicator code
		 *              that will crash when the method is not present.
		 */
		OperatorBase.prototype.needsSelection = function () {
			return false;
		};

		/**
		 * @ngdoc method
		 * @name getPriority
		 * @method
		 * @methodOf OperatorBase
		 * @description Gets the priority of the operator. In general, this will be `1` (the default value) for
		 *              navigation operators and `2` for manipulation operators.
		 * @returns {Number} The priority of the operator.
		 */
		OperatorBase.prototype.getPriority = function () {
			return 1;
		};

		/**
		 * @ngdoc method
		 * @name updateRefPoint
		 * @method
		 * @methodOf OperatorBase
		 * @description Updates the reference point based upon the current model and selection.
		 */
		OperatorBase.prototype.updateRefPoint = function () {
			const op = this;
			retrieveSelectionBounds(this.viewer).then(function (box) {
				op.refPoint = box.center();
			});
		};

		/**
		 * @ngdoc function
		 * @name isInterestingKey
		 * @function
		 * @methodOf OperatorBase
		 * @description Determines whether a given key code is captured by the operator. Subclasses may override
		 *              this method to return a truth-y value for certain keys.
		 * @param {Number} keyCode The key code to examine.
		 * @returns {boolean} A value that indicates whether the key code is captured.
		 */
		OperatorBase.prototype.isInterestingKey = function (keyCode) {
			if (this.ignoreShortcuts) { // TODO: workaround, until shortcuts can be generally handled by an operator with a lower precedence
				return false;
			} else {
				const shortcutKeyMap = modelViewerShortcutService.getShortcutKeyMap(this.viewer[modelViewerShortcutService.getShortcutPropertyName()]);
				return shortcutKeyMap[keyCode];
			}
		};

		/**
		 * @ngdoc function
		 * @name isInterestingModifierKey
		 * @function
		 * @methodOf OperatorBase
		 * @description Determines whether a given key code is captured by the operator and used as a modifier.
		 *              Subclasses may override this method to return a truth-y value for certain keys.
		 * @param {Number} keyCode The key code to examine.
		 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
		 */
		OperatorBase.prototype.isInterestingModifierKey = function (keyCode) {
			switch (keyCode) {
				case keyCodes.SHIFT:
				case keyCodes.ALT:
				case keyCodes.CTRL:
					return true;
				default:
					return false;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onKeyDown
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes key presses. The state of the pressed key is recorded in the internal state of the
		 *              instance.
		 * @param {Communicator.KeyInputEvent} event An object providing some information on the event.
		 */
		OperatorBase.prototype.onKeyDown = function (event) {
			const keyCode = event.getKeyCode();
			if (this.isInterestingModifierKey(keyCode)) {
				this.keyMap[keyCode] = true;
				this.newKeyMap[keyCode] = true;
				event.setHandled(false);
			} else if (this.isInterestingKey(keyCode)) {
				this.keyMap[keyCode] = true;
				this.newKeyMap[keyCode] = true;
				event.setHandled(true);
			} else {
				event.setHandled(false);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onKeyUp
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes key releases. The state of the pressed key is recorded in the internal state of
		 *              the instance.
		 * @param {Communicator.KeyInputEvent} event An object providing some information on the event.
		 */
		OperatorBase.prototype.onKeyUp = function (event) {
			const keyCode = event.getKeyCode();
			if (this.isInterestingModifierKey(keyCode)) {
				this.keyMap[keyCode] = false;
				event.setHandled(false);
			} else if (this.isInterestingKey(keyCode)) {
				this.keyMap[keyCode] = false;
				event.setHandled(true);
			} else {
				event.setHandled(false);
			}
		};

		/**
		 * @ngdoc function
		 * @name isClickingMouseButton
		 * @function
		 * @methodOf OperatorBase
		 * @description Determines whether pressing a given mouse button might indicate the start of a click,
		 *              hence the current position should be stored. Subclasses can override this method
		 *              to return a truth-y value for certain mouse buttons.
		 * @param {Communicator.Button} button The button to check.
		 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
		 */
		OperatorBase.prototype.isClickingMouseButton = function () {
			return false;
		};

		/**
		 * @ngdoc function
		 * @name isDraggingMouseButton
		 * @function
		 * @methodOf OperatorBase
		 * @description Determines whether pressing a given mouse button indicates the start of a dragging
		 *              operation, hence the current position should be stored. Subclasses can override this method
		 *              to return a truth-y value for certain mouse buttons.
		 * @param {Communicator.Button} button The button to check.
		 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
		 */
		OperatorBase.prototype.isDraggingMouseButton = function () {
			return false;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name canStartDrag
		 * @method
		 * @methodOf OperatorBase
		 * @description Checks whether a given mouse input event can start a drag operation (usually based
		 *              on the location of the event).
		 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
		 */
		OperatorBase.prototype.canStartDrag = function (/* event */) {
			return true;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onMouseDown
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes mouse button presses on the viewer.
		 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
		 */
		OperatorBase.prototype.onMouseDown = function (event) {
			if (this.focusViewer) {
				this.focusViewer();
			}

			const btn = event.getButton();
			if (this.isClickingMouseButton(btn) || this.isDraggingMouseButton(btn)) {
				this.clickPosMap[btn] = event.getPosition();
				event.setHandled(this.isDraggingMouseButton(btn) && this.canStartDrag(event));
			} else {
				event.setHandled(false);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onMouseUp
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes mouse button releases on the viewer.
		 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
		 */
		OperatorBase.prototype.onMouseUp = function (event) {
			let isConsidered = false;
			const btn = event.getButton();
			if (this.isClickingMouseButton(btn)) {
				isConsidered = true;

				if (this.currentMousePos && this.clickPosMap[btn]) {
					const dist = Communicator.Point2.distance(this.currentMousePos, this.clickPosMap[btn]);
					if (dist <= 2) {
						if (this.processClick(btn, this.currentMousePos.copy())) {
							this.viewer.rib$operatorCommunicationHub.onMouseButtonAborted.fire(btn);
						}
						event.setHandled(false);
						this.clickPosMap[btn] = null;
						return;
					}
				}
			}

			if (this.isDraggingMouseButton(btn)) {
				isConsidered = true;

				this.processDragEnd(btn, this.currentMousePos.copy());
				event.setHandled(true);
			}

			if (isConsidered) {
				this.clickPosMap[btn] = null;
			} else {
				event.setHandled(false);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onMouseMove
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes mouse movement above the viewer.
		 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
		 */
		OperatorBase.prototype.onMouseMove = function (event) {
			this.currentMousePos = event.getPosition();
		};

		/* Touch Methods */
		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onTouchStart
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes the beginning of a touch operation in the viewer.
		 * @param {Communicator.TouchInputEvent} eventArgs An object providing some information on the event.
		 */
		OperatorBase.prototype.onTouchStart = function (eventArgs) {
			this.touchState.isSingleTouch = this.touchState.count() <= 0;

			this.touchState.touches[eventArgs.getId()] = _.assign(new TouchInfo(eventArgs.getId()), {
				start: eventArgs.getPosition(),
				previous: eventArgs.getPosition(),
				current: eventArgs.getPosition()
			});
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onTouchEnd
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes the end of a touch operation in the viewer.
		 * @param {Communicator.TouchInputEvent} eventArgs An object providing some information on the event.
		 */
		OperatorBase.prototype.onTouchEnd = function (eventArgs) {
			const that = this;

			if (that.touchState.isSingleTouch) {
				const touch = that.touchState.touches[eventArgs.getId()];
				if (touch) {
					const startPos = touch.start;
					if (Communicator.Point2.distance(startPos, eventArgs.getPosition()) < 5) {
						modelViewerHoopsLinkService.selectFromPoint(that.viewer, startPos, false, true);
					}
				}
			}

			delete that.touchState.touches[eventArgs.getId()];
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onTouchMove
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes the movement of a finger (or other touch input appendage) on the viewer.
		 * @param {Communicator.TouchInputEvent} eventArgs An object providing some information on the event.
		 */
		OperatorBase.prototype.onTouchMove = function (eventArgs) {
			const ts = this.touchState.touches[eventArgs.getId()];
			if (ts) {
				ts.current = eventArgs.getPosition();
			}

		};

		function TouchState() {
			this.touches = {};
		}

		function TouchInfo(id) {
			this.id = id;
		}

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name processClick
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes a detected mouse click.
		 * @param {Communicator.Button} button The mouse button clicked.
		 * @param {Communicator.Point2} position The location of the click.
		 * @return {Boolean} A value that indicates whether the click was handled.
		 */
		OperatorBase.prototype.processClick = function () {
			return false;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name processDragEnd
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes the end of a drag operation.
		 * @param {Communicator.Button} button The mouse button clicked.
		 * @param {Communicator.Point2} position The location of the click.
		 */
		OperatorBase.prototype.processDragEnd = function () {
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onMousewheel
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes changes of the mouse wheel.
		 * @param {Communicator.MouseWheelInputEvent} event An object providing some information on the event.
		 */
		OperatorBase.prototype.onMousewheel = function (event) {
			const delta = event.getWheelDelta();
			if (delta > 0) {
				service.zoomIn(this.viewer, delta * 2, event.getPosition());
			} else {
				service.zoomOut(this.viewer, -delta * 2, event.getPosition());
			}
		};

		/**
		 * @ngdoc method
		 * @name performUpdateStep
		 * @method
		 * @methodOf OperatorBase
		 * @description Performs operator-specific updates. Subclasses should override this method to update,
		 *              for instance, the position of the camera based on the current input.
		 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
		 */
		OperatorBase.prototype.performUpdateStep = function () {

		};

		TouchState.prototype.count = function () {
			return this.getAll().length;
		};

		TouchState.prototype.getAll = function () {
			const that = this;
			return _.filter(_.map(_.orderBy(_.map(Object.keys(this.touches), function (touchId) {
				return parseInt(touchId);
			})), function (touchId) {
				return that.touches[touchId];
			}), function (touchInfo) {
				return !!touchInfo;
			});
		};

		TouchState.prototype.updatePinchDistance = function () {
			const touches = this.getAll();
			if ((touches.length >= 2) && touches[0].current && touches[1].current) {
				if (!this.pinchDistance) {
					this.pinchDistance = {};
				}
				this.pinchDistance.previous = this.pinchDistance.current;
				this.pinchDistance.current = Math.abs(Communicator.Point2.distance(touches[0].current, touches[1].current));
				if (!_.isNumber(this.pinchDistance.previous)) {
					this.pinchDistance.previous = this.pinchDistance.current;
				}
			} else {
				this.pinchDistance = null;
			}
		};

		TouchInfo.prototype.getDisplacement = function () {
			if (this.current && this.previous) {
				return Communicator.Point2.subtract(this.current, this.previous);
			} else {
				return Communicator.Point2.zero();
			}
		};

		service.getGeneralGeometryInfo = function (viewer) {
			const view = viewer.view;
			const cam = view.getCamera();
			const camPos = cam.getPosition();
			const camTarget = cam.getTarget();

			if (!viewer.rib$focalPoint) {
				viewer.rib$focalPoint = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer).center();
			}

			const result = {
				camera: cam,
				camPos: camPos,
				camTarget: camTarget,
				cameraChanged: false,
				viewingDirection: Communicator.Point3.subtract(camTarget, camPos),
				bringToOrigin: new Communicator.Matrix().setTranslationComponent(-camPos.x, -camPos.y, -camPos.z),
				returnFromOrigin: new Communicator.Matrix().setTranslationComponent(camPos.x, camPos.y, camPos.z),
				zAxis: new Communicator.Point3(0, 0, 1),
				focalPoint: viewer.rib$focalPoint
			};
			result.normalizedViewingDirection = result.viewingDirection.copy().normalize();
			result.bringToFocalPoint = new Communicator.Matrix().setTranslationComponent(-result.focalPoint.x, -result.focalPoint.y, -result.focalPoint.z);
			result.returnFromFocalPoint = new Communicator.Matrix().setTranslationComponent(result.focalPoint.x, result.focalPoint.y, result.focalPoint.z);
			return result;
		};

		const maximumPitchAngle = 85;

		service.walkOperatorRotate = function (viewer, displacement, geoInfo) {
			const bothPointsMatrices = [];

			if (displacement.x !== 0) {
				geoInfo.cameraChanged = true;
				const yawMatrix = (function () {
					const rotate = Communicator.Matrix.createFromOffAxisRotation(new Communicator.Point3(0, 0, -1), -displacement.x / 50); // instead of 9

					return modelViewerHoopsUtilitiesService.createMatrix(geoInfo.bringToOrigin, rotate, geoInfo.returnFromOrigin);
				})();
				bothPointsMatrices.push(yawMatrix);
			}

			if (displacement.y !== 0) {
				const totalPitchAngle = (function () {
					const horizontalViewingDirection = geoInfo.viewingDirection.copy();
					horizontalViewingDirection.z = 0;
					const totalYawAngle = Communicator.Point2.degreesBetween(new Communicator.Point2(1, 0), horizontalViewingDirection);
					const toXzPlane = Communicator.Matrix.createFromOffAxisRotation(geoInfo.zAxis, -totalYawAngle);
					const xzViewingDirection = Communicator.Point3.zero();
					toXzPlane.transform(geoInfo.viewingDirection, xzViewingDirection);
					let result = Communicator.Point2.degreesBetween(new Communicator.Point2(1, 0), new Communicator.Point2(xzViewingDirection.x, xzViewingDirection.z));

					if (result >= 180) {
						result -= 360;
					}
					return result;
				})();

				let deltaAngle = displacement.y / 50; // instead of 9
				if (deltaAngle > 0) {
					deltaAngle = Math.min(deltaAngle, maximumPitchAngle - totalPitchAngle);
				} else {
					deltaAngle = Math.max(deltaAngle, -maximumPitchAngle - totalPitchAngle);
				}

				if (deltaAngle !== 0) {
					geoInfo.cameraChanged = true;
					const pitchMatrix = (function () {
						const axis = getSidewaysDirection(geoInfo.viewingDirection, geoInfo.zAxis);
						const rotate = Communicator.Matrix.createFromOffAxisRotation(axis, deltaAngle);

						return modelViewerHoopsUtilitiesService.createMatrix(geoInfo.bringToOrigin, rotate, geoInfo.returnFromOrigin);
					})();
					bothPointsMatrices.push(pitchMatrix);
				}
			}

			if (geoInfo.cameraChanged) {
				const newCamPos = Communicator.Point3.zero();
				const newCamTarget = Communicator.Point3.zero();

				if (bothPointsMatrices.length > 0) {
					const bothPointsMatrix = modelViewerHoopsUtilitiesService.createMatrix.apply(null, bothPointsMatrices);
					bothPointsMatrix.transform(geoInfo.camPos, newCamPos);
					bothPointsMatrix.transform(geoInfo.camTarget, newCamTarget);
				}

				geoInfo.camPos = newCamPos;
				geoInfo.camTarget = newCamTarget;
			}
		};

		const minRadius = 10;
		service.pan = function (viewer, displacement, geoInfo) {
			if (displacement.x !== 0) {
				const deltaH = getSidewaysDirection(geoInfo.viewingDirection, new Communicator.Point3(0, 0, 1)).normalize().scale(-displacement.x / 80);
				geoInfo.camPos.add(deltaH);
				geoInfo.camTarget.add(deltaH);
				geoInfo.cameraChanged = true;
			}

			if (displacement.y !== 0) {
				const deltaZ = new Communicator.Point3(0, 0, displacement.y / 80);
				geoInfo.camPos.add(deltaZ);
				geoInfo.camTarget.add(deltaZ);
				geoInfo.cameraChanged = true;
			}
		};

		service.panTopView = function (viewer, displacement) {
			const view = viewer.view;
			const cam = view.getCamera();
			const camPos = cam.getPosition();
			const camTarget = cam.getTarget();
			let changed = false;
			let wasPerspective = false;

			const ps = new Communicator.Point2(displacement.sx, displacement.sy);
			const pe = new Communicator.Point2(displacement.ex, displacement.ey);

			if (cam._projection === Communicator.Projection.Perspective) {
				view.setProjectionMode(Communicator.Projection.Orthographic);
				wasPerspective = true;
			}

			const ws = view.unprojectPoint(ps, 0);
			const we = view.unprojectPoint(pe, 0);

			if (ws && we) {
				const delta = we.subtract(ws);
				camPos.add(delta);
				camTarget.add(delta);
				changed = true;
			}

			if (changed) {
				cam.setPosition(camPos);
				cam.setTarget(camTarget);
				view.updateCamera(cam);
			}

			if (wasPerspective)
				view.setProjectionMode(Communicator.Projection.Perspective);

		};

		service.walkOperatorZoom = function (viewer, deltaDist, geoInfo) {
			if (deltaDist !== 0) {
				const deltaForward = geoInfo.normalizedViewingDirection.copy();
				deltaForward.z = 0;
				deltaForward.normalize().scale(deltaDist / 40);
				geoInfo.camPos.add(deltaForward);
				geoInfo.camTarget.add(deltaForward);
				geoInfo.cameraChanged = true;
			}
		};

		service.selectionAwareTurntableOperatorRotate = function (viewer, displacement, geoInfo) {
			const camPosMatrices = [];

			if (displacement.x !== 0) {
				geoInfo.cameraChanged = true;
				const hRotMatrix = (function () {
					const rotMatrix = Communicator.Matrix.createFromOffAxisRotation(geoInfo.zAxis, -displacement.x / 7);

					return modelViewerHoopsUtilitiesService.createMatrix(geoInfo.bringToFocalPoint, rotMatrix, geoInfo.returnFromFocalPoint);
				})();
				camPosMatrices.push(hRotMatrix);
			}

			if (displacement.y !== 0) {
				const totalPitchAngle = (function () {
					const horizontalViewingDirection = geoInfo.viewingDirection.copy();
					horizontalViewingDirection.z = 0;
					const totalYawAngle = Communicator.Point2.degreesBetween(new Communicator.Point2(1, 0), horizontalViewingDirection);
					const toXzPlane = Communicator.Matrix.createFromOffAxisRotation(geoInfo.zAxis, -totalYawAngle);
					const xzViewingDirection = Communicator.Point3.zero();
					toXzPlane.transform(geoInfo.viewingDirection, xzViewingDirection);
					let result = Communicator.Point2.degreesBetween(new Communicator.Point2(1, 0), new Communicator.Point2(xzViewingDirection.x, xzViewingDirection.z));

					if (result >= 180) {
						result -= 360;
					}

					return result;
				})();

				let deltaAngle = -displacement.y / 7;
				if (deltaAngle > 0) {
					deltaAngle = Math.min(deltaAngle, maximumPitchAngle - totalPitchAngle);
				} else {
					deltaAngle = Math.max(deltaAngle, -maximumPitchAngle - totalPitchAngle);
				}

				if (deltaAngle !== 0) {
					geoInfo.cameraChanged = true;
					const yRotMatrix = (function () {
						const axis = getSidewaysDirection(geoInfo.viewingDirection, geoInfo.zAxis);
						const rotMatrix = Communicator.Matrix.createFromOffAxisRotation(axis, deltaAngle);

						return modelViewerHoopsUtilitiesService.createMatrix(geoInfo.bringToFocalPoint, rotMatrix, geoInfo.returnFromFocalPoint);
					})();
					camPosMatrices.push(yRotMatrix);
				}
			}

			if (geoInfo.cameraChanged) {
				const newCamPos = Communicator.Point3.zero();

				if (camPosMatrices.length > 0) {
					const camPosMatrix = modelViewerHoopsUtilitiesService.createMatrix.apply(null, camPosMatrices);
					camPosMatrix.transform(geoInfo.camPos, newCamPos);
				}

				geoInfo.camPos = newCamPos;
			}
		};

		service.turnableOperatorZoom = function (viewer, deltaDist, geoInfo) {
			if (deltaDist !== 0) {
				const posVector = Communicator.Point3.subtract(geoInfo.camPos, geoInfo.focalPoint);

				const radius = posVector.length();
				const newRadius = Math.max(minRadius, radius + (-deltaDist / 9));

				geoInfo.camPos = Communicator.Point3.add(geoInfo.focalPoint, posVector.normalize().scale(newRadius));
				geoInfo.cameraChanged = true;
			}
		};

		/**
		 * @ngdoc method
		 * @name updateStep
		 * @method
		 * @methodOf OperatorBase
		 * @description Updates the operator based upon the current time.
		 * @param {Number} timestamp The current high-precision timestamp.
		 */
		OperatorBase.prototype.updateStep = function (timestamp) { // jshint ignore:line
			modelViewerShortcutService.executeShortcut(this.viewer[modelViewerShortcutService.getShortcutPropertyName()], this.keyMap, this.newKeyMap);

			if (this.previousTimestamp) {
				const delta = timestamp - this.previousTimestamp;
				if (modelViewerHoopsLinkService.getViewerActive(this.viewer)) {
					this.performUpdateStep(delta);
				}
			}

			this.touchState.updatePinchDistance();

			this.previousMousePos = this.currentMousePos;
			this.newKeyMap = {};

			this.previousTimestamp = timestamp;
			this.runAnimation();
		};

		/**
		 * @ngdoc method
		 * @name runAnimation
		 * @method
		 * @methodOf OperatorBase
		 * @description Launches the animation.
		 */
		OperatorBase.prototype.runAnimation = function () {
			const op = this;
			this.timerId = window.requestAnimationFrame(function (timestamp) {
				op.updateStep(timestamp);
			});
		};

		/**
		 * @ngdoc method
		 * @name onActivate
		 * @method
		 * @methodOf OperatorBase
		 * @description Reacts to the activation of the operator by launching the animation.
		 */
		OperatorBase.prototype.onActivate = function () {
			const that = this;

			this.activationData = this.viewer.rib$operatorActivationData;
			this.viewer.rib$operatorActivationData = null;

			if (!this.abortMouseButton) {
				this.abortMouseButton = function (button) {
					that.clickPosMap[button] = null;
				};
			}

			let opCommHub = this.viewer.rib$operatorCommunicationHub;
			if (!opCommHub) {
				this.viewer.rib$operatorCommunicationHub = opCommHub = {
					onMouseButtonAborted: new PlatformMessenger()
				};
			}
			opCommHub.onMouseButtonAborted.register(this.abortMouseButton);

			this.updateRefPoint();
			this.viewer.setCallbacks(this.viewerCallbacks);

			if (!this.touchHandler) {
				const hwv = this.viewer;
				this.touchHandler = {
					previousScale: null,
					previousDisplacement: null,
					handleStartSingle: function (position) {
						const btn = Communicator.Button.Left;
						if (that.isClickingMouseButton(btn) || that.isDraggingMouseButton(btn)) {
							that.currentMousePos = position;
							that.clickPosMap[btn] = position;
						}
						return false;
					},
					handleMoveSingle: function (position) {
						that.currentMousePos = position;
						return false;
					},
					handleEndSingle: function () {
						const btn = Communicator.Button.Left;
						if (that.isClickingMouseButton(btn)) {
							if (that.currentMousePos && that.clickPosMap[btn]) {
								const dist = Communicator.Point2.distance(that.currentMousePos, that.clickPosMap[btn]);
								if (dist <= 2) {
									if (that.processClick(btn, that.currentMousePos.copy())) {
										that.viewer.rib$operatorCommunicationHub.onMouseButtonAborted.fire(btn);
									}
									return false;
								}
							}
							that.clickPosMap[btn] = null;
						} else if (that.isDraggingMouseButton(btn)) {
							that.processDragEnd(btn, that.currentMousePos.copy());
							that.clickPosMap[btn] = null;
						}
						return false;
					},
					handleStartPinch: function () {
						this.previousScale = 1;
						return true;
					},
					handlePinch: function (scale) {
						if (this.previousScale && (scale !== this.previousScale)) {
							const view = hwv.view;
							const camera = view.getCamera();
							const viewDir = Communicator.Point3.subtract(camera.getTarget(), camera.getPosition()).normalize().scale((scale - this.previousScale) * 40);
							camera.setTarget(Communicator.Point3.add(camera.getTarget(), viewDir));
							view.updateCamera(camera);
						}
						this.previousScale = scale;
						return true;
					},
					handleStartSlide: function (position) {
						const btn = that.panButton;
						if (btn) {
							that.currentMousePos = position;
							that.clickPosMap[btn] = position;
						}
						return false;
					},
					handleSlide: function (position) {
						const btn = that.panButton;
						if (btn) {
							that.currentMousePos = position;
						}
						return false;
					},
					handleEndSlide: function () {
						const btn = that.panButton;
						if (btn) {
							that.clickPosMap[btn] = null;
						}
					}
				};
			}
			modelViewerHoopsTouchService.retrieveTouchManager(this.viewer).registerHandler(this.getPriority(), this.touchHandler);

			if (!this.timerId) {
				this.runAnimation();
			}
		};

		/**
		 * @ngdoc method
		 * @name onDeactivate
		 * @method
		 * @methodOf OperatorBase
		 * @description Reacts to the deactivation of the operator by stopping the animation.
		 */
		OperatorBase.prototype.onDeactivate = function () {
			modelViewerHoopsTouchService.retrieveTouchManager(this.viewer).unregisterHandler(this.touchHandler);

			this.viewer.rib$operatorCommunicationHub.onMouseButtonAborted.unregister(this.abortMouseButton);

			this.viewer.unsetCallbacks(this.viewerCallbacks);
			if (this.timerId) {
				window.cancelAnimationFrame(this.timerId);
				this.timerId = null;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name selectFromPoint
		 * @method
		 * @methodOf OperatorBase
		 * @description Modifies the selection based upon a 2D point in the view.
		 * @param {Communicator.Point2} point The selected point.
		 * @param {boolean} addToSelection Indicates whether the current selection should be extended.
		 * @param {boolean} expandToParent Indicates whether the selection should be extended to the hit item's
		 *                                 parent object.
		 */
		OperatorBase.prototype.selectFromPoint = function (point, addToSelection, expandToParent) {
			modelViewerHoopsLinkService.selectFromPoint(this.viewer, point, addToSelection, expandToParent);
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name addKeyboardZoom
		 * @method
		 * @methodOf OperatorBase
		 * @description Modifies the current movement vector by processing any keyboard-based zoom input.
		 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
		 * @param {Communicator.Point3} viewDirection The current view direction of the camera.
		 * @param {Communicator.Point3} currentMovement A reference to the vector that stores any movement changes
		 *                                              in the current animation step.
		 * @return {boolean} A value that indicates whether `currentMovement` was modified.
		 */
		OperatorBase.prototype.addKeyboardZoom = function (delta, viewDirection, currentMovement) {
			let zoomFactor = 0;
			if (this.keyMap[keyCodes.PAGE_UP]) {
				zoomFactor += this.keyMap[keyCodes.SHIFT] ? 1 : 0.2;
			}
			if (this.keyMap[keyCodes.PAGE_DOWN]) {
				zoomFactor -= this.keyMap[keyCodes.SHIFT] ? 1 : 0.2;
			}

			if (zoomFactor === 0) {
				return false;
			} else {
				const zoom = viewDirection.copy().normalize().scale(zoomFactor * delta);
				currentMovement.add(zoom);
				return true;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name processMousePan
		 * @method
		 * @methodOf OperatorBase
		 * @description Processes the current mouse movement to determine whether a mouse-based panning operation
		 *              is taking place and, if so, replaces any computed current movement. The panning operation
		 *              will only be registered based on the button set in the `panButton` field of the instance.
		 * @param {Communicator.Point3} viewDirection The gaze direction of the camera.
		 * @param {Communicator.Point3} currentMovement A reference to the vector that indicates the camera
		 *                                              translation in the current time step. If mouse-based
		 *                                              panning takes place, this vector will be overwritten.
		 * @return {boolean} A value that indicates whether `currentMovement` was modified.
		 */
		OperatorBase.prototype.processMousePan = function (viewDirection, currentMovement) {
			const dragButton = this.panButton;
			if (_.isUndefined(dragButton) || !_.isNumber(dragButton)) {
				return false;
			}

			if (this.currentMousePos && this.previousMousePos) {
				if (this.clickPosMap[dragButton]) {
					const view = this.viewer.view;

					let relevantRefPoint;
					if (this.refPoint) {
						relevantRefPoint = this.refPoint;
					} else {
						relevantRefPoint = view.getCamera().getPosition().copy().add(viewDirection.copy().normalize().scale(20));
					}

					const oldRay = view.raycastFromPoint(this.previousMousePos);
					const newRay = view.raycastFromPoint(this.currentMousePos);

					const refPlane = Communicator.Plane.createFromPointAndNormal(relevantRefPoint, viewDirection);

					const oldPoint = Communicator.Point3.zero();
					const newPoint = Communicator.Point3.zero();
					if (!(refPlane.intersectsRay(oldRay, oldPoint) && refPlane.intersectsRay(newRay, newPoint))) {
						oldRay.direction.negate();
						newRay.direction.negate();
						if (!(refPlane.intersectsRay(oldRay, newPoint) && refPlane.intersectsRay(newRay, oldPoint))) {
							throw new Error('Reference plane is not parallel to viewport plane.');
						}
					}
					currentMovement.assign(oldPoint.subtract(newPoint));
					return true;
				}
			}

			return false;
		};

		/**
		 * @ngdoc method
		 * @name getContextTools
		 * @method
		 * @methodOf OperatorBase
		 * @description Retrieves an array with toolbar button definitions to control the operator.
		 * @return {Array<Object>} The button definitions.
		 */
		OperatorBase.prototype.getContextTools = function () {
			return [];
		};

		/**
		 * @ngdoc method
		 * @name getInputFeatures
		 * @method
		 * @methodOf OperatorBase
		 * @description Retrieves an array of input features for which a help text is provided.
		 * @return {Array<InputFeature>} The input features.
		 */
		OperatorBase.prototype.getInputFeatures = function () {
			return [
				new modelViewerInputHelpService.InputFeature(10, 'model.viewer.inputHelp.features.zoom', [
					new modelViewerInputHelpService.InputComboSet([
						new modelViewerInputHelpService.KeyAction(keyCodes.PAGE_UP),
						new modelViewerInputHelpService.KeyAction(keyCodes.PAGE_DOWN),
						new modelViewerInputHelpService.MouseWheelAction()
					])
				])
			];
		};

		/* For Touch */

		// noinspection JSValidateJSDoc
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
			const viewPlane = Communicator.Plane.createFromPointAndNormal(Communicator.Point3.zero(), viewDirection);
			const result = Communicator.Point3.zero();
			if (viewPlane.intersectsRay(new Communicator.Ray(upDirection, viewDirection), result) || viewPlane.intersectsRay(new Communicator.Ray(upDirection, viewDirection.copy().negate()), result)) {
				const rotMatrix = Communicator.Matrix.createFromOffAxisRotation(viewDirection, 90);
				rotMatrix.transform(result, result);
				return result.normalize();
			} else {
				throw new Error('No intersection point found.');
			}
		}

		return service;
	}
})(angular);
