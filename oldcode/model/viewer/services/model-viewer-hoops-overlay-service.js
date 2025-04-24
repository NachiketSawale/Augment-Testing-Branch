/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const modelViewerModule = angular.module('model.viewer');

	modelViewerModule.factory('modelViewerHoopsOverlayService',
		modelViewerHoopsOverlayService);

	modelViewerHoopsOverlayService.$inject = ['PlatformMessenger', '_',
		'basicsCommonSmartCanvasService', 'modelViewerHoopsPointProjectionService'];

	function modelViewerHoopsOverlayService(PlatformMessenger, _,
		basicsCommonSmartCanvasService, modelViewerHoopsPointProjectionService) {

		const service = {};

		class HoopsSmartCanvasPointProvider extends basicsCommonSmartCanvasService.SmartCanvasPointProvider {
			constructor(viewer) {
				super('coord3d');

				if (!viewer) {
					throw new Error('No HOOPS viewer supplied.');
				}

				this._viewer = viewer;
				this._pph = new modelViewerHoopsPointProjectionService.PointProjectionHelper(viewer);
				this._points = {}; // TODO: remove?

				const that = this;

				// no deregistration required - point provider lives as long as HOOPS viewer,
				// and point projection helper is exclusive to point provider
				that._pph.registerInvalidated(function projectedPointsInvalidated(pointIds) {
					if (that._generalInvalidationActive) {
						return;
					}

					const newlyInvalidatedPointIds = [];
					if (Array.isArray(pointIds)) {
						if (!_.isObject(that._currentlyInvalidatedPointIds)) {
							that._currentlyInvalidatedPointIds = {};
						}

						for (let ptId of pointIds) {
							if (!that._currentlyInvalidatedPointIds[ptId]) {
								that._currentlyInvalidatedPointIds[ptId] = true;
								newlyInvalidatedPointIds.push(ptId);
							}
						}
						if (newlyInvalidatedPointIds.length <= 0) {
							return;
						}
					} else {
						that._generalInvalidationActive = true;
					}

					that.firePointsUpdated(pointIds);

					for (let ptId of newlyInvalidatedPointIds) {
						delete that._currentlyInvalidatedPointIds[ptId];
					}
					that._generalInvalidationActive = false;
				});
			}

			setPoint(id, spec) {
				if (!_.isObject(spec)) {
					throw new Error('Invalid point specification.');
				}

				if (!this._points[id]) {
					this._points[id] = {id: id};
				}

				this._pph.setPoint(id, spec);
				this._pph.invalidatePoints(id);
			}

			removePoint(id) {
				this._pph.removePoint(id);
				delete this._points[id];
			}

			projectPoint(id) {
				const pt = this._points[id];
				if (!pt) {
					throw new Error(`Unknown point ID: ${id}`);
				}

				const result = this._pph.projectPoint(id);
				return _.isNil(result) ? null : new basicsCommonSmartCanvasService.ProjectedPoint(result.x, result.y);
			}

			enrichDrawingData(drawingData) {
				drawingData.viewer = this._viewer;
			}

			suspendPointUpdates() {
				this._pph.suspendPointUpdates();
			}

			resumePointUpdates() {
				this._pph.resumePointUpdates();
			}
		}

		service.initOverlay = function (smartCanvasManager, viewer) {
			if (smartCanvasManager && viewer) {
				smartCanvasManager.addPointProvider(new HoopsSmartCanvasPointProvider(viewer));
			}
		};

		return service;
	}
})(angular);
