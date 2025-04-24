/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsSubModelAlignmentService
	 * @function
	 *
	 * @description Provides HOOPS-specific routines and an operator for sub-model alignment in composite models.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsSubModelAlignmentService', modelViewerHoopsSubModelAlignmentService);

	modelViewerHoopsSubModelAlignmentService.$inject = ['_', '$q', 'Communicator',
		'platformPromiseUtilitiesService', 'modelViewerSubModelAlignmentService',
		'modelViewerHoopsPointProjectionService', 'modelViewerSubModelAlignmentPosDialogService',
		'modelViewerHoopsOperatorManipulationService', 'modelViewerHoopsSnappingService',
		'modelViewerHoopsUtilitiesService'];

	function modelViewerHoopsSubModelAlignmentService(_, $q, Communicator, platformPromiseUtilitiesService, modelViewerSubModelAlignmentService,
		modelViewerHoopsPointProjectionService, modelViewerSubModelAlignmentPosDialogService,
		modelViewerHoopsOperatorManipulationService, modelViewerHoopsSnappingService,
		modelViewerHoopsUtilitiesService) {

		const service = {};

		const PointerOperator = modelViewerHoopsOperatorManipulationService.PointerOperator;

		const updateRefPointsMenu = function (modeInfo) {
			this._refPointsList.items = _.map(modeInfo.refPoints, function (rp) {
				return {
					id: rp.id,
					type: 'radio',
					value: rp.id,
					caption: rp.title,
					iconClass: rp.icon,
					fn: function () {
						modelViewerSubModelAlignmentService.selectRefPoint(rp.id);
					}
				};
			});
			this._refPointsList.activeValue = modelViewerSubModelAlignmentService.getSelectedRefPointId();
		};

		const updateFixedViewMenu = function (modeInfo) {
			this._fixedViewList.items = [{}];
			if (modeInfo.id !== 'xyz'){
				const that = this;
				this._fixedViewList.items.push({
					id: 'fixedView',
					type: 'check',
					caption: 'model.viewer.operator.subModelAlignment.fixedView',
					iconClass: 'tlb-icons ico-view-fixed',
					fn: function (id, btn) {
						if (btn.value) {
							if (that._refPointsPlane) {
								that._originalCamera = that.viewer.view.getCamera();
								const fixedCamera = that._originalCamera.copy();
								updateFixedCamera.call(that, fixedCamera);
							}
						} else {
							destroyFixedCamera.call(that);

						}
						updateModesMenu(that, btn.value);
					}
				});
			}
		};

		const updateModesMenu = function (that, isFixedView) {
			if (!isFixedView) {
				that._modesList.items = _.cloneDeep(that._modesItemsList);
			} else {
				that._modesList.items = that._modesItemsList.filter(x => x.id !== 'xyzMode');
			}
		};

		function createHoopsRefPointsPlane(modeInfo) {
			const pt = modeInfo.refPointsPlane.point;
			const normal = modeInfo.refPointsPlane.normal;
			return Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(pt.x, pt.y, pt.z),
				new Communicator.Point3(normal.x, normal.y, normal.z));
		}

		const updateFixedCamera = function (fixedCamera) {
			const that = this;

			fixedCamera.setProjection(Communicator.Projection.Orthographic);
			that.viewer.model.getModelBounding(true, false).then(function (bBox) {
				const modeInfo = modelViewerSubModelAlignmentService.getActiveModeInfo();
				if (modeInfo) {
					modeInfo.refPoints.forEach(function (rp) {
						const pos = modelViewerSubModelAlignmentService.getRefPoint(rp.id);
						if (pos) {
							bBox.addPoint(new Communicator.Point3(pos.x, pos.y, pos.z));
						}
					});
				}

				const direction = that._refPointsPlane.normal.copy().normalize().scale(-1);
				const target = bBox.center();
				const camPos = Communicator.Point3.add(target, direction);
				fixedCamera.setTarget(target);
				fixedCamera.setPosition(camPos);
				const up = ((Math.abs(direction.x) <= 0.00001) && (Math.abs(direction.y) <= 0.00001)) ? new Communicator.Point3(0, 1, 0) : new Communicator.Point3(0, 0, 1);
				fixedCamera.setUp(up);
				that.viewer.view.setCamera(fixedCamera);
				return that.viewer.view.fitBounding(bBox, 0);
			});
		};

		const destroyFixedCamera = function () {
			const that = this;

			if (that._originalCamera) {
				that.viewer.view.setCamera(that._originalCamera);
				delete that._originalCamera;
				return true;
			}

			return false;
		};

		const createStateListener = function () {
			const that = this;

			const sl = new modelViewerSubModelAlignmentService.SubModelAlignmentStateListener();

			sl.modeChanged = function () {
				const modeInfo = modelViewerSubModelAlignmentService.getActiveModeInfo();
				if (that._modesList) {
					that._modesList.activeValue = modeInfo.id;
				}
				if (that._refPointsList) {
					updateRefPointsMenu.call(that, modeInfo);
					updateFixedViewMenu.call(that, modeInfo);
				}
				that._refPointsPlane = createHoopsRefPointsPlane(modeInfo);

				if (that.isFixedViewActive()) {
					updateFixedCamera.call(that, that.viewer.view.getCamera());
				}

				if (modeInfo.id === 'xyz') {
					that._snappingToolBar.setToggleSnappingProvider('nearestVertices', true);
				}
			};

			sl.selectedRefPointChanged = function () {
				if (that._refPointsList) {
					that._refPointsList.activeValue = modelViewerSubModelAlignmentService.getSelectedRefPointId();
				}
			};

			return sl;
		};

		function SubModelAlignmentOperator(viewer, viewerSettings, focusViewer) {
			PointerOperator.call(this, viewer, viewerSettings, focusViewer);

			this._stateListener = createStateListener.call(this);
			this._snappingManager = null;
			this._snappingToolBar = modelViewerHoopsSnappingService.generateToolBar();
		}

		SubModelAlignmentOperator.prototype = Object.create(PointerOperator.prototype);
		SubModelAlignmentOperator.prototype.constructor = SubModelAlignmentOperator;

		service.SubModelAlignmentOperator = SubModelAlignmentOperator;

		/**
		 * @ngdoc method
		 * @name onActivate
		 * @method
		 * @methodOf SubModelAlignmentOperator
		 * @description Initializes 3D helper objects in the viewer.
		 */
		SubModelAlignmentOperator.prototype.onActivate = function () {
			const that = this;

			if (!that._isActive) {
				PointerOperator.prototype.onActivate.call(that);

				modelViewerSubModelAlignmentService.registerViewers('hoops', [that.viewer]);

				that._projectionHelper = new modelViewerHoopsPointProjectionService.PointProjectionHelper(this.viewer);
				modelViewerSubModelAlignmentService.registerPointProjectionHelper(that._projectionHelper);

				modelViewerSubModelAlignmentService.registerStateListener(that._stateListener);

				that._snappingManager = new modelViewerHoopsSnappingService.SnappingManager(that.viewer, this._snappingToolBar);

				that._invalidateProjectionHelper = _.debounce(function () {
					that._projectionHelper.invalidatePoints();
				}, {
					wait: 300,
					maxWait: 500
				});

				that._isActive = true;
			}
		};

		/**
		 * @ngdoc method
		 * @name onDeactivate
		 * @method
		 * @methodOf SubModelAlignmentOperator
		 * @description Finalizes some 3D helper objects in the viewer.
		 */
		SubModelAlignmentOperator.prototype.onDeactivate = function () {
			if (this._isActive) {
				destroyFixedCamera.call(this);

				this._isActive = false;

				this._snappingManager.dispose();
				this._snappingManager = null;

				modelViewerSubModelAlignmentService.unregisterStateListener(this._stateListener);

				modelViewerSubModelAlignmentService.unregisterViewers('hoops', [this.viewer]);

				modelViewerSubModelAlignmentService.unregisterPointProjectionHelper(this._projectionHelper);
				this._projectionHelper.dispose();
				this._projectionHelper = null;
				this._invalidateProjectionHelper = null;

				PointerOperator.prototype.onDeactivate.call(this);
			}
		};

		const findPointNear = function (pos2d) {
			const that = this;
			const pts = that._projectionHelper.findPointsAt(pos2d, {
				radius: 20,
				maxCount: 1
			});
			return pts.length > 0 ? pts[0] : null;
		};

		// noinspection JSValidateJSDoc // the validator fails to recognize MouseInputEvent
		/**
		 * @ngdoc method
		 * @name canStartDrag
		 * @method
		 * @methodOf SubModelAlignmentOperator
		 * @description Checks whether a given mouse input event can start a drag operation (usually based
		 *              on the location of the event).
		 * @param {Communicator.Event.MouseInputEvent} event An object providing some information on the event.
		 */
		SubModelAlignmentOperator.prototype.canStartDrag = function (event) {
			const that = this;

			switch (event.getButton()) {
				case Communicator.Button.Left:
					return (function () {
						const pos = event.getPosition();
						const pt = findPointNear.call(that, pos);
						if (pt) {
							that._dragInfo = {
								pt: pt.ptId
							};
							modelViewerSubModelAlignmentService.selectRefPoint(pt.ptId);
							return true;
						}
						modelViewerSubModelAlignmentService.selectRefPoint(null);
						return that.isFixedViewActive();
					})();
			}
			return that.isFixedViewActive();
		};

		// noinspection JSValidateJSDoc // the validator fails to recognize MouseInputEvent
		/**
		 * @ngdoc method
		 * @name onMouseUp
		 * @method
		 * @methodOf SubModelAlignmentOperator
		 * @description Processes mouse button releases on the viewer.
		 * @param {Communicator.Event.MouseInputEvent} event An object providing some information on the event.
		 */
		SubModelAlignmentOperator.prototype.onMouseUp = function (event) {
			const that = this;

			switch (event.getButton()) {
				case Communicator.Button.Left:
					if (that._dragInfo) {
						that._projectionHelper.invalidatePoints([that._dragInfo.pt]);
						that._dragInfo = null;
					}
					break;
			}

			PointerOperator.prototype.onMouseUp.apply(this, arguments);

			event.setHandled(false);
		};

		/**
		 * @ngdoc method
		 * @name performUpdateStep
		 * @method
		 * @methodOf SubModelAlignmentOperator
		 * @description Updates the scene based on the current input.
		 */
		SubModelAlignmentOperator.prototype.performUpdateStep = function () {
			if (this.currentMousePos) {
				this._snappingManager.updatePointerPosition('pointer', this.currentMousePos.copy());

				if (this.clickPosMap[Communicator.Button.Left]) {
					if (this._dragInfo) {
						const pointerPos = this.currentMousePos;
						const refId = this._dragInfo.pt;
						let activePlane = this._refPointsPlane.copy();
						let mode = this._modesList.activeValue;
						if (mode === 'xyz' && refId === 'target') {
							activePlane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, 0),
								new Communicator.Point3(0, 0, -1));
						}

						const snappedPoint = this._snappingManager.findPointAt(pointerPos.x, pointerPos.y);
						if (snappedPoint) {
							let pt = snappedPoint.pos3d;
							if (mode.includes('Rot')) {
								pt = modelViewerSubModelAlignmentService.forcePositionFix(mode, refId, pt);
							}

							if ((!mode.includes('Rot') && refId === 'source') || (mode.includes('Rot') && refId === 'rotAxis')) {
								modelViewerSubModelAlignmentService.setSubModelCornerPos(pt);
							}
							modelViewerSubModelAlignmentService.updateRefPoint(refId, pt);
						} else {
							const ray = this.viewer.view.raycastFromPoint(pointerPos);
							const pt = activePlane.rayIntersection(ray);
							if (pt) {
								if ((!mode.includes('Rot') && refId === 'source') || (mode.includes('Rot') && refId === 'rotAxis')) {
									modelViewerSubModelAlignmentService.setSubModelCornerPos(null);
								}
								modelViewerSubModelAlignmentService.updateRefPoint(refId, pt);
							}
						}

						if (refId === 'target' && modelViewerSubModelAlignmentService.getSubModelCornerPos() !== null) {
							modelViewerSubModelAlignmentService.previewMesh();
						} else if (modelViewerSubModelAlignmentService.getSubModelCornerPos() === null) {
							modelViewerSubModelAlignmentService.removePreviewMesh();
						}
					}
				}
			}
		};

		/**
		 * @ngdoc method
		 * @name getContextTools
		 * @method
		 * @methodOf SubModelAlignmentOperator
		 * @description Retrieves an array with toolbar button definitions to control the operator.
		 * @return {Array<Object>} The button definitions.
		 */
		SubModelAlignmentOperator.prototype.getContextTools = function () {
			const that = this;

			function selectMode(id, btn) {
				modelViewerSubModelAlignmentService.activateMode(btn.value);
				that._invalidateProjectionHelper();
			}

			that._modesItemsList = [{
				 id: 'xyMode',
				 type: 'radio',
				 value: modelViewerSubModelAlignmentService.modes.xyTranslation,
				 caption: 'model.viewer.operator.subModelAlignment.modes.xy',
				 iconClass: 'tlb-icons ico-view-move-xy',
				 fn: selectMode
			 }, {
				 id: 'zMode',
				 type: 'radio',
				 value: modelViewerSubModelAlignmentService.modes.zTranslation,
				 caption: 'model.viewer.operator.subModelAlignment.modes.z',
				 iconClass: 'tlb-icons ico-view-move-z',
				 fn: selectMode
			 }, {
				 id: 'xyzMode',
				 type: 'radio',
				 value: modelViewerSubModelAlignmentService.modes.xyzTranslation,
				 caption: 'model.viewer.operator.subModelAlignment.modes.xyz',
				 iconClass: 'tlb-icons ico-view-move-xyz',
				 fn: selectMode
			 }, {
				 id: 'xRotMode',
				 type: 'radio',
				 value: modelViewerSubModelAlignmentService.modes.xRotation,
				 caption: 'model.viewer.operator.subModelAlignment.modes.xRot',
				 iconClass: 'tlb-icons ico-view-rotate-x',
				 fn: selectMode
			 }, {
				 id: 'yRotMode',
				 type: 'radio',
				 value: modelViewerSubModelAlignmentService.modes.yRotation,
				 caption: 'model.viewer.operator.subModelAlignment.modes.yRot',
				 iconClass: 'tlb-icons ico-view-rotate-y',
				 fn: selectMode
			 }, {
				 id: 'zRotMode',
				 type: 'radio',
				 value: modelViewerSubModelAlignmentService.modes.zRotation,
				 caption: 'model.viewer.operator.subModelAlignment.modes.zRot',
				 iconClass: 'tlb-icons ico-view-rotate-z',
				 fn: selectMode
			}];
			that._modesList = {
				cssClass: 'radio-group',
				activeValue: modelViewerSubModelAlignmentService.modes.xyTranslation,
				items: _.cloneDeep(that._modesItemsList)
			};

			that._refPointsList = {
				cssClass: 'radio-group',
				activeValue: undefined,
				items: [{}]
			};
			that._fixedViewList = {
				cssClass: 'radio-group',
				activeValue: undefined,
				items: [{}]
			};

			updateRefPointsMenu.call(that, modelViewerSubModelAlignmentService.getActiveModeInfo());
			updateFixedViewMenu.call(that, modelViewerSubModelAlignmentService.getActiveModeInfo());

			return [{
				id: 'mode',
				type: 'sublist',
				caption: 'model.viewer.operator.subModelAlignment.modes.title',
				list: that._modesList
			}, /*{
				id: 'fixedView',
				type: 'check',
				caption: 'model.viewer.operator.subModelAlignment.fixedView',
				iconClass: 'tlb-icons ico-view-fixed',
				fn: function (id, btn) {
					if (btn.value) {
						if (that._refPointsPlane) {
							that._originalCamera = that.viewer.view.getCamera();
							const fixedCamera = that._originalCamera.copy();
							updateFixedCamera.call(that, fixedCamera);
						}
					} else {
						destroyFixedCamera.call(that);
					}
				}
			}*/ {
				id: 'fixedView',
				type: 'sublist',
				caption: 'model.viewer.operator.subModelAlignment.fixedView',
				list: that._fixedViewList
			}, {
				id: 'refPoints',
				type: 'sublist',
				caption: 'model.viewer.operator.subModelAlignment.refPoints.title',
				list: that._refPointsList
			}, that._snappingToolBar.menuItem, {
				id: 'manipulateRefPoint',
				type: 'sublist',
				list: {
					showTitles: true,
					items: [{
						id: 'changeRefPoint',
						type: 'item',
						caption: 'model.viewer.subModelAlignment.refPtDlg.command',
						iconClass: 'tlb-icons ico-view-point-displacement',
						fn: function () {
							displaceRefPoint(that._refPointsPlane);
						}
					}]
				}
			}, {
				id: 'execution',
				type: 'sublist',
				list: {
					showTitles: true,
					items: [{
						id: 'apply',
						type: 'item',
						caption: 'model.viewer.operator.subModelAlignment.apply',
						iconClass: 'tlb-icons ico-view-apply-transformation',
						fn: function () {
							modelViewerSubModelAlignmentService.applyTransformation().then(function () {
								if (_.isFunction(that._invalidateProjectionHelper)) {
									that._invalidateProjectionHelper();
								}
							});
						}
					}, {
						id: 'reset',
						type: 'item',
						caption: 'model.viewer.operator.subModelAlignment.reset',
						iconClass: 'tlb-icons ico-2dqto-calibratereset',
						fn: function () {
							modelViewerSubModelAlignmentService.resetTransformation();
						}
					}]
				}
			}].concat(PointerOperator.prototype.getContextTools());
		};

		/**
		 * @ngdoc function
		 * @name isDraggingMouseButton
		 * @function
		 * @methodOf SubModelAlignmentOperator
		 * @description Determines whether pressing a given mouse button indicates the start of a dragging
		 *              operation, hence the current position should be stored. Subclasses can override this method
		 *              to return a truth-y value for certain mouse buttons.
		 * @param {Communicator.Button} button The button to check.
		 * @returns {boolean} A value that indicates whether the given button can start a dragging operation.
		 */
		SubModelAlignmentOperator.prototype.isDraggingMouseButton = function (button) {
			switch (button) {
				case Communicator.Button.Left:
					return true;
				default:
					return this.isFixedViewActive();
			}
		};

		/**
		 * @ngdoc function
		 * @name isFixedViewActive
		 * @function
		 * @methodOf SubModelAlignmentOperator
		 * @description Indicates whether the fixed view is currently active.
		 * @returns {boolean} A value that indicates the fixed view state.
		 */
		SubModelAlignmentOperator.prototype.isFixedViewActive = function () {
			return Boolean(this._originalCamera);
		};

		function displaceRefPoint(refPointsPlane) {
			const modeInfo = modelViewerSubModelAlignmentService.getActiveModeInfo();
			modelViewerSubModelAlignmentPosDialogService.showDialog(modeInfo.refPoints, modelViewerSubModelAlignmentService.getSelectedRefPointId()).then(function (result) {
				if (result) {
					const baseVector = result.absolute ? {
						x: 0,
						y: 0,
						z: 0
					} : modelViewerSubModelAlignmentService.getRefPoint(result.refPointId);

					let newPoint = new Communicator.Point3(baseVector.x + result.vector.x,
						baseVector.y + result.vector.y,
						baseVector.z + result.vector.z);
					if (refPointsPlane) {
						const ray = new Communicator.Ray(newPoint, refPointsPlane.normal);
						const projectedPoint = refPointsPlane.rayIntersection(ray);
						if (projectedPoint) {
							newPoint = projectedPoint;
						}
					}

					modelViewerSubModelAlignmentService.selectRefPoint(result.refPointId);
					modelViewerSubModelAlignmentService.updateRefPoint(result.refPointId, newPoint);
				}
			});
		}

		return service;
	}
})(angular);
