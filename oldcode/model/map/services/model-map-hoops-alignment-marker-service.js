/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.map.modelMapHoopsAlignmentMarkerService
	 * @function
	 *
	 * @description Provides a class that manages map alignment markers in the HOOPS viewer.
	 */
	angular.module('model.map').factory('modelMapHoopsAlignmentMarkerService',
		modelMapHoopsAlignmentMarkerService);

	modelMapHoopsAlignmentMarkerService.$inject = ['modelMapAlignmentMarkerService',
		'Communicator', '_', 'modelViewerHoopsRuntimeDataService',
		'modelViewerHoopsOperatorUtilitiesService'];

	function modelMapHoopsAlignmentMarkerService(modelMapAlignmentMarkerService,
		Communicator, _, modelViewerHoopsRuntimeDataService,
		modelViewerHoopsOperatorUtilitiesService) {

		const service = {};

		function getActualHitPoint(viewer, hitPlane, x, y) {
			const viewPoint = new Communicator.Point2(x, y);
			const ray = viewer.view.raycastFromPoint(viewPoint);
			const hitPoint3d = hitPlane.rayIntersection(ray);
			return new Communicator.Point2(hitPoint3d.x, hitPoint3d.y);
		}

		function HoopsAlignmentMarkerManager(viewer, overlayLink, alignmentControllerLink) {
			this._viewer = viewer;

			modelMapAlignmentMarkerService.AlignmentMarkerManager.call(this, overlayLink, alignmentControllerLink);
		}

		HoopsAlignmentMarkerManager.prototype = Object.create(modelMapAlignmentMarkerService.AlignmentMarkerManager.prototype);
		HoopsAlignmentMarkerManager.prototype.constructor = HoopsAlignmentMarkerManager;

		HoopsAlignmentMarkerManager.prototype.worldToDisplay = function (x, y) {
			const markerZLevel = this.getMarkerZLevel();
			return this._viewer.view.projectPoint(new Communicator.Point3(x, y, markerZLevel));
		};

		HoopsAlignmentMarkerManager.prototype.displayToWorld = function (x, y) {
			return getActualHitPoint(this._viewer, this.getMarkerPlane(), x, y);
		};

		HoopsAlignmentMarkerManager.prototype.getMarkerPlane = function () {
			const bBox = modelViewerHoopsRuntimeDataService.getBoundingBox(this._viewer);
			return Communicator.Plane.createFromPointAndNormal(bBox.center(), new Communicator.Point3(0, 0, 1));
		};

		HoopsAlignmentMarkerManager.prototype.getMarkerZLevel = function () {
			return modelViewerHoopsRuntimeDataService.getBoundingBox(this._viewer).center().z;
		};

		HoopsAlignmentMarkerManager.prototype.zoom = function (x, y, delta) {
			if (delta > 0) {
				modelViewerHoopsOperatorUtilitiesService.zoomIn(this._viewer, delta / 40, new Communicator.Point2(x, y));
			} else {
				modelViewerHoopsOperatorUtilitiesService.zoomOut(this._viewer, -delta / 40, new Communicator.Point2(x, y));
			}
		};

		HoopsAlignmentMarkerManager.prototype.pan = function (sx, sy, ex, ey) {
			const displacement = [];
			displacement.sx = sx;
			displacement.sy = sy;
			displacement.ex = ex;
			displacement.ey = ey;
			modelViewerHoopsOperatorUtilitiesService.panTopView(this._viewer, displacement);
		};

		const fieldName = 'rib$HoopsAlignmentMarkerManager';

		service.createManager = function (viewer, overlayLink, alignmentControllerLink) {
			if (viewer[fieldName]) {
				throw new Error('An alignment marker manager has already been initialized on the specified viewer object.');
			}

			return viewer[fieldName] = new HoopsAlignmentMarkerManager(viewer, overlayLink, alignmentControllerLink);
		};

		service.getManager = function (viewer) {
			if (!viewer[fieldName]) {
				throw new Error('The specified viewer does not have an alignment marker manager.');
			}

			return viewer[fieldName];
		};

		return service;
	}
})(angular);
