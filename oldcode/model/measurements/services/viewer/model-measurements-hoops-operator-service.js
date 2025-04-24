/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.measurements.viewer.modelMeasurementHoopsOperatorService
	 * @function
	 *
	 * @description Provides an operator for measuring the distance, area and volume between points in the 3D scene.
	 */
	angular.module('model.measurements').factory('modelMeasurementHoopsOperatorService',
		modelMeasurementHoopsOperatorService);

	modelMeasurementHoopsOperatorService.$inject = ['modelViewerHoopsOperatorManipulationService',
		'modelViewerHoopsSnappingService', 'Communicator', 'modelMeasurementOverlayDataService', '$q'];

	function modelMeasurementHoopsOperatorService(modelViewerHoopsOperatorManipulationService,
		modelViewerHoopsSnappingService, Communicator, modelMeasurementOverlayDataService, $q) {

		const service = {};

		function selectedMeasurementMode(id, btn) {
			modelMeasurementOverlayDataService.activateMeasurementMode(btn);
		}

		class MeasurementOperator extends modelViewerHoopsOperatorManipulationService.PointerOperator {
			constructor(viewer, viewerSettings, focusViewer, viewRecord) {
				super(viewer, viewerSettings, focusViewer);

				this._snappingManager = null;
				this._snappingToolBar = modelViewerHoopsSnappingService.generateToolBar();
				this._viewRecord = viewRecord;
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
			}

			processClick(button, position) {
				const that = this;

				switch (button) {
					case Communicator.Button.Left:
						that._getSpatialPosition(position).then(function (spatialPos) {
							that.viewer.rib$measurementOverlay.addPreviewPoint(spatialPos.x, spatialPos.y, spatialPos.z);
							modelMeasurementOverlayDataService.addPoint(spatialPos.x, spatialPos.y, spatialPos.z);
						});
						return true;
					case Communicator.Button.Right:
						that._getSpatialPosition(position).then(function (spatialPos) {
							const measurement = modelMeasurementOverlayDataService.getActiveMeasurement();
							modelMeasurementOverlayDataService.addPoint(spatialPos.x, spatialPos.y, spatialPos.z, true);
						});
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
					//that.viewer.rib$measurementOverlay.hideLivePreviewPoint();
				}
			}

			getContextTools() {
				const that = this;

				return [{
					id: 'radioGroup',
					type: 'sublist',
					list: {
						cssClass: 'radio-group',
						showTitles: true,
						items: [{
							id: 'distance',
							value: 'distance',
							type: 'radio',
							caption: 'model.measurements.modes.distance',
							iconClass: 'tlb-icons ico-measure-point',
							fn: selectedMeasurementMode
						}, {
							id: 'perimeter',
							value: 'perimete',
							type: 'radio',
							caption: 'model.measurements.modes.perimeter',
							iconClass: 'tlb-icons ico-measure-perimeter',
							fn: selectedMeasurementMode
						}, {
							id: 'area',
							value: 'area',
							type: 'radio',
							caption: 'model.measurements.modes.area',
							iconClass: 'tlb-icons ico-measure-surface',
							fn: selectedMeasurementMode
						}, {
							id: 'volume',
							value: 'volume',
							type: 'radio',
							caption: 'model.measurements.modes.volume',
							iconClass: 'tlb-icons ico-measure-3d-body',
							fn: selectedMeasurementMode
						},
						]
					}
				}, {
					id: 'save',
					type: 'item',
					caption: 'model.measurements.save',
					iconClass: 'tlb-icons ico-save2',
					fn: function () {
						modelMeasurementOverlayDataService.saveMeasurement(that._viewRecord);
					}
				}, this._snappingToolBar.menuItem];
			}
		}
		service.MeasurementOperator = MeasurementOperator;

		return service;
	}
})(angular);
