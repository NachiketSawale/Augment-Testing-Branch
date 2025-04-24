/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsMeasurementOperatorService
	 * @function
	 *
	 * @description Provides an operator for measuring the distance between points in the 3D scene.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsMeasurementOperatorService',
		modelViewerHoopsMeasurementOperatorService);

	modelViewerHoopsMeasurementOperatorService.$inject = ['modelViewerHoopsOperatorManipulationService',
		'modelViewerHoopsSnappingService', 'Communicator', 'modelViewerMeasurementDataService', '$q'];

	function modelViewerHoopsMeasurementOperatorService(modelViewerHoopsOperatorManipulationService,
		modelViewerHoopsSnappingService, Communicator, modelViewerMeasurementDataService, $q) {

		const service = {};

		class MeasurementOperator extends modelViewerHoopsOperatorManipulationService.PointerOperator {
			constructor(viewer, viewerSettings, focusViewer) {
				super(viewer, viewerSettings, focusViewer);

				this._snappingManager = null;
				this._snappingToolBar = modelViewerHoopsSnappingService.generateToolBar();
			}

			onActivate() {
				const that = this;

				if (!that._isActive) {
					super.onActivate();

					that._snappingManager = new modelViewerHoopsSnappingService.SnappingManager(that.viewer, that._snappingToolBar);

					that._isActive = true;
				}
			}

			onDeactivate() {
				if (this._isActive) {
					this._isActive = false;

					this._snappingManager.dispose();
					this._snappingManager = null;

					super.onDeactivate();
				}
			}

			_getSpatialPosition(viewportPos) {
				const that = this;

				if (that._snappedPoint) {
					return $q.when(that._snappedPoint);
				}

				const pickConfig = new Communicator.PickConfig();
				pickConfig.allowFaces = true;

				return that.viewer.view.pickAllFromPoint(viewportPos, pickConfig).then(function (nodes) {
					if (nodes.length > 0) {
						return nodes[nodes.length - 1].getPosition();
					}
					return null;
				}).then(function (spatialPos) {
					if (!spatialPos) {
						const ray = that.viewer.view.raycastFromPoint(viewportPos);
						spatialPos = Communicator.Point3.add(ray.origin, ray.direction.normalize().scale(10));
					}
					return spatialPos;
				});

				/*
				const pickConfig = new Communicator.IncrementalPickConfig();
				pickConfig.respectVisibility = false;
				pickConfig.allowFaces = true;

				// let hitObjectIds = new modelViewerModelIdSetService.ObjectIdSet();
				const selectabilityInfo = modelViewerSelectabilityService.getSelectabilityInfo(that.viewer);
				return that.viewer.view.beginRayDrillSelection(viewportPos, 1, pickConfig).then(function (incSelId) {
					return platformPromiseUtilitiesService.doWhile(function (incSelId) {
						return that.viewer.view.advanceIncrementalSelection(incSelId).then(function (selItems) {
							if (Array.isArray(selItems) && (selItems.length > 0)) {
								for (let i = 0; i < selItems.length; i++) {
									const hitMeshId = modelViewerHoopsLinkService.viewerToMeshId(that.viewer, selItems[i].getNodeId());
									if (hitMeshId) {
										if (selectabilityInfo.isMeshSelectable(hitMeshId.subModelId, hitMeshId.meshId)) {
											console.log(selItems[i]);

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
						return that.viewer.view.endIncrementalSelection(incSelId);
					});
				}).then(() => console.log('click done'));
				 */
			}

			canStartDrag(event) {
				const that = this;

				switch (event.getButton()) {
					case Communicator.Button.Left: {
						const pos = event.getPosition();
						that._getSpatialPosition(pos).then(function (spatialPos) {
							that._dragInfo = {
								start2d: pos,
								start: spatialPos
							};
							that.viewer.rib$measurementOverlay.addPreviewPoint(spatialPos.x, spatialPos.y, spatialPos.z);
						});
					}
						return true;
				}

				return false;
			}

			isDraggingMouseButton(button) {
				switch (button) {
					case Communicator.Button.Left:
						return true;
				}
			}

			processClick(button/* , position */) {
				const that = this;

				switch (button) {
					case Communicator.Button.Left:
						that._dragInfo = null;
						that.viewer.rib$measurementOverlay.clearPreviewPoints();
						return true;
				}
			}

			processDragEnd(button, position) {
				const that = this;

				switch (button) {
					case Communicator.Button.Left:
						if (that._dragInfo) {
							const startPos = that._dragInfo.start;
							that._getSpatialPosition(position).then(function (spatialPos) {
								modelViewerMeasurementDataService.addStraightDistance(startPos, spatialPos);
							});
							that._dragInfo = null;
							that.viewer.rib$measurementOverlay.clearPreviewPoints();
						}
						return true;
				}
			}

			performUpdateStep() {
				const that = this;

				if (that.currentMousePos) {
					this._snappingManager.updatePointerPosition('pointer', that.currentMousePos.copy());

					const snappedPoint = this._snappingManager.findPointAt(that.currentMousePos.x, that.currentMousePos.y);
					if (snappedPoint) {
						that._snappedPoint = snappedPoint.pos3d;
						that.viewer.rib$measurementOverlay.showLivePreviewPoint(snappedPoint.pos3d.x, snappedPoint.pos3d.y, snappedPoint.pos3d.z);
					} else {
						that._snappedPoint = null;
						that.viewer.rib$measurementOverlay.hideLivePreviewPoint();
					}
				} else {
					that.viewer.rib$measurementOverlay.hideLivePreviewPoint();
				}
			}

			getContextTools() {
				return [this._snappingToolBar.menuItem];
			}
		}

		service.MeasurementOperator = MeasurementOperator;

		return service;
	}
})(angular);
