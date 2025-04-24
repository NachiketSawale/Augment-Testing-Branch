/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsOperatorManipulationService
	 * @function
	 *
	 * @description Provides [custom manipulation operators](http://rib-tst-cloud01/preview2/documentation/build/viewer-web-client-custom-operators.html)
	 *              for the Hoops 3D Viewer. The service provides names of the operators, as well as factory
	 *              functions for instantiating the operators for a given viewer with a given viewer settings object.
	 *              Optionally, the constructor functions also accept a method for focusing the viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsOperatorManipulationService',
		modelViewerHoopsOperatorManipulationService);

	modelViewerHoopsOperatorManipulationService.$inject = ['keyCodes', 'Communicator',
		'modelViewerHoopsOperatorUtilitiesService', 'modelViewerHoopsUtilitiesService',
		'modelViewerHoopsCuttingService', 'modelViewerInputHelpService',
		'platformDragdropService', 'modelViewerHoopsOperatorPositioningService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerHoopsLinkService',
		'modelViewerObjectTreeService', '$injector', 'platformPromiseUtilitiesService', '_'];

	function modelViewerHoopsOperatorManipulationService(keyCodes, Communicator,
		modelViewerHoopsOperatorUtilitiesService, modelViewerHoopsUtilitiesService,
		modelViewerHoopsCuttingService, modelViewerInputHelpService,
		platformDragdropService, modelViewerHoopsOperatorPositioningService,
		modelViewerCompositeModelObjectSelectionService, modelViewerHoopsLinkService,
		modelViewerObjectTreeService, $injector, platformPromiseUtilitiesService, _) {

		const service = {};

		let modelViewerHoopsSubModelAlignmentService = null;
		let modelMeasurementHoopsOperatorService = null;

		const OperatorBase = modelViewerHoopsOperatorUtilitiesService.OperatorBase;

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name PointerOperator
		 * @constructor
		 * @methodOf PointerOperator
		 * @description Initializes a new instance.
		 * @param {Communicator.Viewer} viewer The viewer.
		 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
		 *                                operators linked to it.
		 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
		 */
		function PointerOperator(viewer, viewerSettings, focusViewer) {
			OperatorBase.call(this, viewer, viewerSettings, focusViewer);

			this.ignoreShortcuts = true;
		}

		PointerOperator.prototype = Object.create(OperatorBase.prototype);
		PointerOperator.prototype.constructor = PointerOperator;

		service.PointerOperator = PointerOperator;

		/**
		 * @ngdoc method
		 * @name getPriority
		 * @method
		 * @methodOf PointerOperator
		 * @description Gets the priority of the operator. In general, this will be `1` (the default value) for
		 *              navigation operators and `2` for manipulation operators.
		 * @returns {Number} The priority of the operator.
		 */
		PointerOperator.prototype.getPriority = function () {
			return 2;
		};

		/**
		 * @ngdoc function
		 * @name isClickingMouseButton
		 * @function
		 * @methodOf PointerOperator
		 * @description Determines whether pressing a given mouse button might indicate the start of a click,
		 *              hence the current position should be stored. Subclasses can override this method
		 *              to return a truth-y value for certain mouse buttons.
		 * @param {Communicator.Button} button The button to check.
		 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
		 */
		PointerOperator.prototype.isClickingMouseButton = function (button) {
			switch (button) {
				case Communicator.Button.Left:
					return true;
				case Communicator.Button.Right:
					return true;
				default:
					return OperatorBase.prototype.isClickingMouseButton.call(this, button);
			}
		};

		/**
		 * @ngdoc function
		 * @name isInterestingModifierKey
		 * @function
		 * @methodOf PointerOperator
		 * @description Determines whether a given key code is captured by the operator and used as a modifier.
		 *              Subclasses may override this method to return a truth-y value for certain keys.
		 * @param {Number} keyCode The key code to examine.
		 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
		 */
		PointerOperator.prototype.isInterestingModifierKey = function (keyCode) {
			switch (keyCode) {
				case keyCodes.SHIFT:
					return true;
				default:
					return OperatorBase.prototype.isInterestingModifierKey.call(this, keyCode);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name processClick
		 * @method
		 * @methodOf PointerOperator
		 * @description Processes a detected mouse click.
		 * @param {Communicator.Button} button The mouse button clicked.
		 * @param {Communicator.Point2} position The location of the click.
		 * @return {Boolean} A value that indicates whether the click was handled.
		 */
		PointerOperator.prototype.processClick = function (button, position) {
			switch (button) {
				case Communicator.Button.Left:
					this.selectFromPoint(position, this.keyMap[keyCodes.SHIFT], this.keyMap[keyCodes.ALT]);
					return true;
				default:
					return false;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name CutOperator
		 * @constructor
		 * @methodOf CutOperator
		 * @description Initializes a new instance.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
		 *                                operators linked to it.
		 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
		 */
		function CutOperator(viewer, viewerSettings, focusViewer) {
			OperatorBase.call(this, viewer, viewerSettings, focusViewer);

			this.ignoreShortcuts = true;
			this.currentPlane = modelViewerHoopsCuttingService.planes.z;
		}

		CutOperator.prototype = Object.create(OperatorBase.prototype);
		CutOperator.prototype.constructor = CutOperator;

		/**
		 * @ngdoc function
		 * @name onActivate
		 * @function
		 * @methodOf CutOperator
		 * @description Initializes cutting-related resources and disables object pickability to switch the viewer
		 *              into cutting mode.
		 */
		CutOperator.prototype.onActivate = function () {
			this.mgr = modelViewerHoopsCuttingService.createManager(this.viewer, this.viewerSettings);
			this.mgr.setActivePlane(this.currentPlane);

			OperatorBase.prototype.onActivate.call(this);
		};

		/**
		 * @ngdoc function
		 * @name onDeactivate
		 * @function
		 * @methodOf CutOperator
		 * @description Finalizes cutting-related resources and enables object pickability to switch off cutting
		 *              mode in the viewer.
		 */
		CutOperator.prototype.onDeactivate = function () {
			this.mgr.destroy();
			this.mgr = null;

			OperatorBase.prototype.onDeactivate.call(this);
		};

		/**
		 * @ngdoc method
		 * @name getPriority
		 * @method
		 * @methodOf CutOperator
		 * @description Gets the priority of the operator. In general, this will be `1` (the default value) for
		 *              navigation operators and `2` for manipulation operators.
		 * @returns {Number} The priority of the operator.
		 */
		CutOperator.prototype.getPriority = function () {
			return 2;
		};

		/**
		 * @ngdoc function
		 * @name isInterestingKey
		 * @function
		 * @methodOf CutOperator
		 * @description Determines whether a given key code is captured by the operator.
		 * @param {Number} keyCode The key code to examine.
		 * @returns {boolean} A value that indicates whether the key code is captured.
		 */
		CutOperator.prototype.isInterestingKey = function (keyCode) {
			switch (keyCode) {
				case keyCodes.LEFT:
				case keyCodes.RIGHT:
				case keyCodes.UP:
				case keyCodes.DOWN:
				case keyCodes.SPACE:
					return true;
				default:
					return OperatorBase.prototype.isInterestingKey.call(this, keyCode);
			}
		};

		/**
		 * @ngdoc function
		 * @name isInterestingModifierKey
		 * @function
		 * @methodOf CutOperator
		 * @description Determines whether a given key code is captured by the operator and used as a modifier.
		 *              Subclasses may override this method to return a truth-y value for certain keys.
		 * @param {Number} keyCode The key code to examine.
		 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
		 */
		CutOperator.prototype.isInterestingModifierKey = function (keyCode) {
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
		 * @methodOf CutOperator
		 * @description Updates the position of the camera based upon current input.
		 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
		 */
		CutOperator.prototype.performUpdateStep = function (delta) {
			if (this.newKeyMap[keyCodes.SPACE]) {
				this.mgr.toggle();
			}

			if (this.keyMap[keyCodes.ALT]) {
				if (this.newKeyMap[keyCodes.RIGHT] || this.newKeyMap[keyCodes.DOWN]) {
					switch (this.currentPlane) {
						case modelViewerHoopsCuttingService.planes.x:
							this.currentPlane = modelViewerHoopsCuttingService.planes.y;
							break;
						case modelViewerHoopsCuttingService.planes.y:
							this.currentPlane = modelViewerHoopsCuttingService.planes.z;
							break;
						case modelViewerHoopsCuttingService.planes.z:
							this.currentPlane = modelViewerHoopsCuttingService.planes.x;
							break;
					}
					this.mgr.setActivePlane(this.currentPlane);
				}
				if (this.newKeyMap[keyCodes.LEFT] || this.newKeyMap[keyCodes.UP]) {
					switch (this.currentPlane) {
						case modelViewerHoopsCuttingService.planes.x:
							this.currentPlane = modelViewerHoopsCuttingService.planes.z;
							break;
						case modelViewerHoopsCuttingService.planes.y:
							this.currentPlane = modelViewerHoopsCuttingService.planes.x;
							break;
						case modelViewerHoopsCuttingService.planes.z:
							this.currentPlane = modelViewerHoopsCuttingService.planes.y;
							break;
					}
					this.mgr.setActivePlane(this.currentPlane);
				}
			} else {
				if (this.keyMap[keyCodes.CTRL]) {
					if (this.keyMap[keyCodes.UP]) {
						this.mgr.moveRotationAxis(this.currentPlane, 0, -delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005));
					}
					if (this.keyMap[keyCodes.DOWN]) {
						this.mgr.moveRotationAxis(this.currentPlane, 0, delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005));
					}
					if (this.keyMap[keyCodes.LEFT]) {
						this.mgr.moveRotationAxis(this.currentPlane, delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005), 0);
					}
					if (this.keyMap[keyCodes.RIGHT]) {
						this.mgr.moveRotationAxis(this.currentPlane, -delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005), 0);
					}
				} else {
					if (this.keyMap[keyCodes.UP]) {
						this.mgr.movePlane(this.currentPlane, delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005));
					}
					if (this.keyMap[keyCodes.DOWN]) {
						this.mgr.movePlane(this.currentPlane, -delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005));
					}
					if (this.keyMap[keyCodes.LEFT]) {
						this.mgr.rotateAroundZ(this.currentPlane, delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005));
					}
					if (this.keyMap[keyCodes.RIGHT]) {
						this.mgr.rotateAroundZ(this.currentPlane, -delta * (this.keyMap[keyCodes.SHIFT] ? 0.05 : 0.005));
					}
				}
			}

			const that = this;
			if (this.currentMousePos) {
				if (this.clickPosMap[Communicator.Button.Left]) {
					if (this.keyMap[keyCodes.CTRL]) {
						let deltaClickPos = this.currentMousePos.copy();
						deltaClickPos.subtract(this.clickPosMap[Communicator.Button.Left]);
						deltaClickPos = modelViewerHoopsOperatorUtilitiesService.preprocessMouseInput(deltaClickPos);

						this.mgr.rotateAroundZ(this.currentPlane, deltaClickPos.x * (this.keyMap[keyCodes.SHIFT] ? 0.015 : 0.005));
					} else {
						if (this.dragData) {
							const ray = this.viewer.view.raycastFromPoint(this.currentMousePos);
							const hitPt = Communicator.Point3.zero();
							if (this.dragData.intersectsRay(ray, hitPt)) {
								if (this.isDraggingAxis) {
									this.mgr.moveRotationAxis(this.currentPlane, hitPt.x, hitPt.y, true);
								} else {
									const movedPlane = this.mgr.getPlane(this.currentPlane);
									const dist = movedPlane.distanceToPoint(hitPt);
									this.mgr.movePlane(this.currentPlane, dist);
								}
							}
						} else {
							if (!this.isDraggedObjectRequested) {
								this.isDraggedObjectRequested = true;
								this.mgr.checkAxisHit(this.clickPosMap[Communicator.Button.Left], this.currentPlane).then(function (result) {
									if (that.isDraggedObjectRequested) {
										that.isDraggingAxis = Boolean(result);
										that.isDraggedObjectRequested = false;
										that.dragData = result || that.mgr.getPlaneMovementPlane(that.clickPosMap[Communicator.Button.Left], that.currentPlane);
									}
								});
							}
						}
					}
				} else {
					if (!this.keyMap[keyCodes.CTRL]) {
						this.isDraggedObjectKnown = false;
						this.isDraggedObjectRequested = false;
						this.dragData = null;
					}
				}
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onMousewheel
		 * @method
		 * @methodOf CutOperator
		 * @description Processes changes of the mouse wheel.
		 * @param {Communicator.MouseWheelInputEvent} event An object providing some information on the event.
		 */
		CutOperator.prototype.onMousewheel = function (event) {
			if (this.keyMap[keyCodes.ALT]) {
				OperatorBase.prototype.onMousewheel.call(this, event);
			} else {
				const delta = event.getWheelDelta();
				if (this.keyMap[keyCodes.CTRL]) {
					this.mgr.rotateAroundZ(this.currentPlane, delta * (this.keyMap[keyCodes.SHIFT] ? 1.5 : 0.4));
				} else {
					this.mgr.movePlane(this.currentPlane, delta * (this.keyMap[keyCodes.SHIFT] ? 0.8 : 0.1));
				}
				event.setHandled(true);
			}
		};

		/**
		 * @ngdoc function
		 * @name isDraggingMouseButton
		 * @function
		 * @methodOf CutOperator
		 * @description Determines whether pressing a given mouse button indicates the start of a dragging
		 *              operation, hence the current position should be stored.
		 * @param {Communicator.Button} button The button to check.
		 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
		 */
		CutOperator.prototype.isDraggingMouseButton = function (button) {
			switch (button) {
				case Communicator.Button.Left:
					return true;
				default:
					return false;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onMouseDown
		 * @method
		 * @methodOf CutOperator
		 * @description Processes mouse button presses on the viewer.
		 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
		 */
		CutOperator.prototype.onMouseDown = function (event) {
			OperatorBase.prototype.onMouseDown.call(this, event);

			const that = this;
			switch (event.getButton()) {
				case Communicator.Button.Right:
					this.mgr.pickPlaneFromPoint(event.getPosition()).then(function (planeId) {
						if (planeId) {
							that.currentPlane = planeId;
							that.mgr.setActivePlane(that.currentPlane);
						}
					});
					event.setHandled(true);
					break;
			}
		};

		/**
		 * @ngdoc method
		 * @name getContextTools
		 * @method
		 * @methodOf CutOperator
		 * @description Retrieves an array with toolbar button definitions to control the operator.
		 * @return {Array<Object>} The button definitions.
		 */
		CutOperator.prototype.getContextTools = function () {
			const that = this;
			return [{
				id: 'reset',
				type: 'sublist',
				caption: 'model.viewer.operator.cut.tools.reset',
				list: {
					items: [{
						id: 'resetPlanePosition',
						type: 'item',
						caption: 'model.viewer.operator.cut.tools.resetPlanePos',
						iconClass: 'tlb-icons ico-view-reset-plane-pos',
						fn: function () {
							that.mgr.resetPlanePosition(that.currentPlane);
							if (that.focusViewer) {
								that.focusViewer();
							}
						}
					}, {
						id: 'resetAxisPosition',
						type: 'item',
						caption: 'model.viewer.operator.cut.tools.resetAxisPos',
						iconClass: 'tlb-icons ico-view-reset-axis-pos',
						fn: function () {
							that.mgr.resetAxisPosition(that.currentPlane);
							if (that.focusViewer) {
								that.focusViewer();
							}
						}
					}, {
						id: 'resetAngle',
						type: 'item',
						caption: 'model.viewer.operator.cut.tools.resetAngle',
						iconClass: 'tlb-icons ico-view-reset-rotation',
						fn: function () {
							that.mgr.resetPlaneAngle(that.currentPlane);
							if (that.focusViewer) {
								that.focusViewer();
							}
						}
					}]
				}
			}, {
				id: 'mode',
				type: 'sublist',
				caption: 'model.viewer.operator.cut.tools.mode',
				list: {
					items: [{
						id: 'active',
						type: 'item',
						caption: 'model.viewer.operator.cut.tools.active',
						iconClass: 'tlb-icons ico-view-toggle-cutting',
						fn: function () {
							that.mgr.toggle();
							if (that.focusViewer) {
								that.focusViewer();
							}
						}
					}]
				}
			}].concat(OperatorBase.prototype.getContextTools());
		};

		/**
		 * @ngdoc method
		 * @name getInputFeatures
		 * @method
		 * @methodOf CutOperator
		 * @description Retrieves an array of input features for which a help text is provided.
		 * @return {Array<InputFeature>} The input features.
		 */
		CutOperator.prototype.getInputFeatures = function () {
			const result = OperatorBase.prototype.getInputFeatures.call(this);
			result.push(new modelViewerInputHelpService.InputFeature(1050, 'model.viewer.inputHelp.features.toggleCutting', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.KeyAction(keyCodes.SPACE)
				])
			]));
			result.push(new modelViewerInputHelpService.InputFeature(1048, 'model.viewer.inputHelp.features.selectCuttingPlane', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.MouseButtonClickAction(modelViewerInputHelpService.mouseButtons.RIGHT)
				]),
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.KeyAction(keyCodes.UP),
					new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
					new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
					new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
				], [keyCodes.ALT])
			]));
			result.push(new modelViewerInputHelpService.InputFeature(1046, 'model.viewer.inputHelp.features.moveCuttingPlane', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.MouseWheelAction()
				]),
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.KeyAction(keyCodes.UP),
					new modelViewerInputHelpService.KeyAction(keyCodes.DOWN)
				])
			]));
			result.push(new modelViewerInputHelpService.InputFeature(1044, 'model.viewer.inputHelp.features.rotateCuttingPlane', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.MouseWheelAction(),
					new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL)
				], [keyCodes.CTRL]),
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
					new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
				])
			]));
			result.push(new modelViewerInputHelpService.InputFeature(1042, 'model.viewer.inputHelp.features.moveCuttingPlaneAxis', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.KeyAction(keyCodes.UP),
					new modelViewerInputHelpService.KeyAction(keyCodes.DOWN),
					new modelViewerInputHelpService.KeyAction(keyCodes.LEFT),
					new modelViewerInputHelpService.KeyAction(keyCodes.RIGHT)
				], [keyCodes.CTRL])
			]));
			result.push(new modelViewerInputHelpService.InputFeature(1040, 'model.viewer.inputHelp.features.moveCuttingPlaneOrAxis', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL),
					new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
				])
			]));
			result.push(new modelViewerInputHelpService.InputFeature(30, 'model.viewer.inputHelp.features.accelerate', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.ModifierKeyAction(keyCodes.SHIFT)
				])
			]));
			return result;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name DragOperator
		 * @constructor
		 * @methodOf DragOperator
		 * @description Initializes a new instance.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
		 *                                operators linked to it.
		 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
		 */
		function DragOperator(viewer, viewerSettings, focusViewer) {
			OperatorBase.call(this, viewer, viewerSettings, focusViewer);

			this.ignoreShortcuts = true;
		}

		DragOperator.prototype = Object.create(OperatorBase.prototype);
		DragOperator.prototype.constructor = DragOperator;

		/**
		 * @ngdoc method
		 * @name getPriority
		 * @method
		 * @methodOf DragOperator
		 * @description Gets the priority of the operator. In general, this will be `1` (the default value) for
		 *              navigation operators and `2` for manipulation operators.
		 * @returns {Number} The priority of the operator.
		 */
		DragOperator.prototype.getPriority = function () {
			return 2;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name onMouseDown
		 * @method
		 * @methodOf DragOperator
		 * @description Processes mouse button presses on the viewer.
		 * @param {Communicator.MouseInputEvent} event An object providing some information on the event.
		 */
		DragOperator.prototype.onMouseDown = function (event) {
			// Disable drag-and-drop functionality
			if (this.isDragModeDisabled) {
				return; // Prevent drag-and-drop if disabled
			}
			switch (event.getButton()) {
				case Communicator.Button.Left: {
					const newObjectIds = service.getDraggedObjectsIds();
					const selCount = newObjectIds.objectIds.totalCount(true);

					if (selCount > 0) {
						platformDragdropService.startDrag({
							draggingFromViewer: true,
							getDraggedObjectIds: service.getDraggedObjectsIds
						}, [
							platformDragdropService.actions.link
						], {
							number: selCount,
							text: 'model.viewer.operator.drag.objectData'
						});
					}
					event.setHandled(true);
				}
					return;
			}
			OperatorBase.prototype.onMouseDown.call(this, event);
		};

		/**
		 * @ngdoc method
		 * @name getInputFeatures
		 * @method
		 * @methodOf DragOperator
		 * @description Retrieves an array of input features for which a help text is provided.
		 * @return {Array<InputFeature>} The input features.
		 */
		/*
		DragOperator.prototype.getInputFeatures = function () {
			const result = OperatorBase.prototype.getInputFeatures.call(this);
			result.push(new modelViewerInputHelpService.InputFeature(1080, 'model.viewer.inputHelp.features.dragObjects', [
				new modelViewerInputHelpService.InputComboSet([
					new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.HORIZONTAL),
					new modelViewerInputHelpService.MouseButtonDragAction(modelViewerInputHelpService.mouseButtons.LEFT, modelViewerInputHelpService.dragDirection.VERTICAL)
				])
			]));
			return result;
		};
		  */
		/**
		 * @ngdoc method
		 * @name getContextTools
		 * @method
		 * @methodOf platformDragdropService
		 * @description Retrieves an array with toolbar button definitions to control the operator.
		 * @return {Array<Object>} The button definitions.
		 */
		DragOperator.prototype.getContextTools = function () {

			return [{
				id: 'reset',
				type: 'sublist',
				caption: 'model.viewer.operator.platformDragdropService.mode',
				list: {
					cssClass: 'radio-group',
					activeValue: getActiveMode(),
					items: [{
						id: 'mode-1',
						value: 'mode-1',
						type: 'radio',
						caption: 'model.viewer.selectionWz.treePartMinimal',
						iconClass: 'tlb-icons ico-object-restrictions-1',
						fn: function () {
							DragOperator.treePartMode = 'min';
						}
					}, {
						id: 'mode-2',
						value: 'mode-2',
						type: 'radio',
						caption: 'model.viewer.selectionWz.treePartLeaves',
						iconClass: 'tlb-icons ico-object-restrictions-3',
						fn: function () {
							DragOperator.treePartMode = 'l';
						}
					}, {
						id: 'mode-3',
						value: 'mode-3',
						type: 'radio',
						caption: 'model.viewer.selectionWz.treePartMinimalCompositeAndLeaves',
						iconClass: 'tlb-icons ico-object-restrictions-5',
						fn: function () {
							DragOperator.treePartMode = 'mincl';
						}
					}]
				}
			}].concat(OperatorBase.prototype.getContextTools());
		};

		/**
		 * @ngdoc method
		 * @name getActiveMode
		 * @method
		 * @methodOf modelViewerHoopsOperatorManipulationService
		 * @description Decide which dragOperator Mode to be pre selected.
		 * @return the active mode weather the intial one or the previous selected one.
		 */
		function getActiveMode() {
			let mode;
			if (DragOperator.treePartMode) {
				if (DragOperator.treePartMode === 'min') {
					mode = 'mode-1';
					DragOperator.treePartMode = 'min';
				} else if (DragOperator.treePartMode === 'l') {
					mode = 'mode-2';
					DragOperator.treePartMode = 'l';
				}
			} else {
				mode = 'mode-1';
				DragOperator.treePartMode = 'min';
			}

			return mode;

		}

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name AreaSelectOperator
		 * @constructor
		 * @methodOf AreaSelectOperator
		 * @description Initializes a new instance.
		 * @param {Communicator.WebViewer} viewer The viewer.
		 * @param {Object} viewerSettings An object that provides configuration settings for the viewer and any
		 *                                operators linked to it.
		 * @param {Function} focusViewer An optional function that sets the keyboard focus to the viewer.
		 */
		function AreaSelectOperator(viewer, viewerSettings, focusViewer) {
			OperatorBase.call(this, viewer, viewerSettings, focusViewer);

			this.rectStart = null;
			this.ignoreShortcuts = true;
			this.isAreaActive = false;
			this.isAreaAborted = false;

			const gom = this.viewer.getGraphicalOverlayManager();
			this.updateCursorPosition = _.debounce(function () {
				if (this.currentMousePos) {
					gom.updateCursorPos(this.currentMousePos.x, this.currentMousePos.y);
				}
			}, 8, {
				leading: true,
				maxWait: 10,
				trailing: false
			});
		}

		AreaSelectOperator.prototype = Object.create(OperatorBase.prototype);
		AreaSelectOperator.prototype.constructor = AreaSelectOperator;

		/**
		 * @ngdoc method
		 * @name onActivate
		 * @method
		 * @methodOf AreaSelectOperator
		 * @description Initializes some helper graphics.
		 */
		AreaSelectOperator.prototype.onActivate = function () {
			OperatorBase.prototype.onActivate.call(this);

			const gom = this.viewer.getGraphicalOverlayManager();
			gom.showCursorCrosshair();
		};

		/**
		 * @ngdoc method
		 * @name onDeactivate
		 * @method
		 * @methodOf AreaSelectOperator
		 * @description Makes sure some helper graphics disappear.
		 */
		AreaSelectOperator.prototype.onDeactivate = function () {
			const gom = this.viewer.getGraphicalOverlayManager();
			gom.clearSelectionRectangle();
			gom.clearCursorCrosshair();

			OperatorBase.prototype.onDeactivate.call(this);
		};

		/**
		 * @ngdoc method
		 * @name getPriority
		 * @method
		 * @methodOf AreaSelectOperator
		 * @description Gets the priority of the operator. In general, this will be `1` (the default value) for
		 *              navigation operators and `2` for manipulation operators.
		 * @returns {Number} The priority of the operator.
		 */
		AreaSelectOperator.prototype.getPriority = function () {
			return 2;
		};

		/**
		 * @ngdoc function
		 * @name isDraggingMouseButton
		 * @function
		 * @methodOf AreaSelectOperator
		 * @description Determines whether pressing a given mouse button indicates the start of a dragging
		 *              operation, hence the current position should be stored.
		 * @param {Communicator.Button} button The button to check.
		 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
		 */
		AreaSelectOperator.prototype.isDraggingMouseButton = function (button) {
			switch (button) {
				case Communicator.Button.Left:
					return true;
				default:
					return false;
			}
		};

		/**
		 * @ngdoc function
		 * @name isInterestingKey
		 * @function
		 * @methodOf AreaSelectOperator
		 * @description Determines whether a given key code is captured by the operator.
		 * @param {Number} keyCode The key code to examine.
		 * @returns {boolean} A value that indicates whether the key code is captured.
		 */
		AreaSelectOperator.prototype.isInterestingKey = function (keyCode) {
			switch (keyCode) {
				case keyCodes.ESCAPE:
					return true;
				default:
					return OperatorBase.prototype.isInterestingKey.call(this, keyCode);
			}
		};

		/**
		 * @ngdoc function
		 * @name isInterestingModifierKey
		 * @function
		 * @methodOf AreaSelectOperator
		 * @description Determines whether a given key code is captured by the operator and used as a modifier.
		 *              Subclasses may override this method to return a truth-y value for certain keys.
		 * @param {Number} keyCode The key code to examine.
		 * @returns {boolean} A value that indicates whether the key code is captured as a modifier key.
		 */
		AreaSelectOperator.prototype.isInterestingModifierKey = function (keyCode) {
			switch (keyCode) {
				case keyCodes.SHIFT:
				case keyCodes.CTRL:
					return true;
				default:
					return OperatorBase.prototype.isInterestingModifierKey.call(this, keyCode);
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name performUpdateStep
		 * @method
		 * @methodOf AreaSelectOperator
		 * @description Updates the position of the camera based upon current input.
		 * @param {Number} delta The number of milliseconds passed since the last invocation of the method.
		 */
		AreaSelectOperator.prototype.performUpdateStep = function (/* delta */) {
			const that = this;

			function includePartialObjects() {
				if (that.keyMap[keyCodes.CTRL]) {
					return true;
				} else if (that.viewerSettings.areaSelectByDirection) {
					return that.rectStart.x > that.currentMousePos.x;
				}
				return false;
			}

			if (this.newKeyMap[keyCodes.ESCAPE]) {
				this.isAreaAborted = true;
			}

			this.updateCursorPosition();

			let gom;
			const leftClickPos = this.clickPosMap[Communicator.Button.Left];
			if (leftClickPos) {
				if (this.isAreaAborted) {
					if (this.isAreaActive) {
						gom = this.viewer.getGraphicalOverlayManager();
						gom.clearSelectionRectangle();
						this.isAreaActive = false;
						this.rectStart = null;
					}
				} else {
					gom = this.viewer.getGraphicalOverlayManager();
					if (!this.isAreaActive) {
						this.rectStart = leftClickPos.copy();
						gom.showSelectionRectangle();
						this.isAreaActive = true;
					}
					gom.updateSelectionRectangle(Math.min(leftClickPos.x, this.currentMousePos.x),
						Math.min(leftClickPos.y, this.currentMousePos.y),
						Math.abs(leftClickPos.x - this.currentMousePos.x),
						Math.abs(leftClickPos.y - this.currentMousePos.y));
					gom.setSelectionRectangleIncludesPartial(includePartialObjects());
				}
			} else {
				if (this.isAreaActive) {
					if (!this.isAreaAborted) {
						const size = Math.abs(this.rectStart.x - this.currentMousePos.x) * Math.abs(this.rectStart.y - this.currentMousePos.y);
						if (size >= 9) {
							modelViewerHoopsLinkService.selectFromRectangle(this.viewer,
								this.rectStart, this.currentMousePos,
								this.keyMap[keyCodes.SHIFT],
								includePartialObjects());
						} else {
							modelViewerHoopsLinkService.selectFromPoint(this.viewer,
								this.rectStart,
								this.keyMap[keyCodes.SHIFT],
								false);
						}
					}

					gom = this.viewer.getGraphicalOverlayManager();
					gom.clearSelectionRectangle();
					this.isAreaActive = false;
					this.isAreaAborted = false;
					this.rectStart = null;
				}
				this.isAreaAborted = false;
			}
		};

		service.operatorNames = ['pointerOperator', 'areaSelectOperator', 'dragOperator', 'cutOperator', 'measureOperator', 'positionOperator', 'subModelAlignmentOperator'];
		service.operators = {
			pointerOperator: function (viewer, viewerSettings, focusViewer) {
				return new PointerOperator(viewer, viewerSettings, focusViewer);
			},
			areaSelectOperator: function (viewer, viewerSettings, focusViewer) {
				return new AreaSelectOperator(viewer, viewerSettings, focusViewer);
			},
			dragOperator: function (viewer, viewerSettings, focusViewer) {
				return new DragOperator(viewer, viewerSettings, focusViewer);
			},
			cutOperator: function (viewer, viewerSettings, focusViewer) {
				return new CutOperator(viewer, viewerSettings, focusViewer);
			},
			measureOperator: function (viewer, viewerSettings, focusViewer, viewRecord) {
				if (!modelMeasurementHoopsOperatorService) {
					modelMeasurementHoopsOperatorService = $injector.get('modelMeasurementHoopsOperatorService');
				}

				return new modelMeasurementHoopsOperatorService.MeasurementOperator(viewer, viewerSettings, focusViewer, viewRecord);
			},
			positionOperator: function (viewer, viewerSettings, focusViewer) {
				return new modelViewerHoopsOperatorPositioningService.PositioningOperator(viewer, viewerSettings, focusViewer);
			},
			subModelAlignmentOperator: function (viewer, viewerSettings, focusViewer) {
				if (!modelViewerHoopsSubModelAlignmentService) {
					modelViewerHoopsSubModelAlignmentService = $injector.get('modelViewerHoopsSubModelAlignmentService');
				}
				return new modelViewerHoopsSubModelAlignmentService.SubModelAlignmentOperator(viewer, viewerSettings, focusViewer);
			}
		};

		service.getDraggedObjectsIds = function () {
			let newObjects;
			const settings = [];
			const objects = [];
			objects.objectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();

			const mode = getActiveMode();

			if (DragOperator.treePartMode) {
				settings.treePart = DragOperator.treePartMode;

				if (mode === 'mode-1') {
					settings.treePart = 'min';
				} else if (mode === 'mode-2') {
					settings.treePart = 'l';
				}
			} else {
				settings.treePart = 'min';
			}

			newObjects = modelViewerObjectTreeService.retrieveObjectsByMode(objects, settings);
			return newObjects;
		};

		service.menuDescriptors = [{
			optionId: 'pointer',
			operatorId: 'pointer',
			isBuiltIn: false,
			icon: 'view-select'
		}, {
			optionId: 'areaSelect',
			operatorId: 'areaSelect',
			isBuiltIn: false,
			icon: 'view-selection'
		}, {
			optionId: 'drag',
			operatorId: 'drag',
			isBuiltIn: false,
			icon: 'view-drag'
		}, {
			optionId: 'cut',
			operatorId: 'cut',
			isBuiltIn: false,
			icon: 'view-cutting-planes'
		}, {
			optionId: 'measure',
			operatorId: 'measure',
			isBuiltIn: false,
			icon: 'control-icons ico-view-m-point'
		}, {
			optionId: 'position',
			operatorId: 'position',
			isBuiltIn: false,
			icon: 'select-position',
			isTemporarilyVisible: true
		}, {
			optionId: 'subModelAlignment',
			operatorId: 'subModelAlignment',
			isBuiltIn: false,
			icon: 'view-submodel-alignment',
			isTemporarilyVisible: true
		}];

		return service;
	}
})(angular);
