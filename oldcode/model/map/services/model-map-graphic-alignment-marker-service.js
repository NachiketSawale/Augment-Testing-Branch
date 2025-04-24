/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.map.modelMapGraphicAlignmentMarkerService
	 * @function
	 *
	 * @description Provides a class that manages map alignment markers in the graphics display.
	 */
	angular.module('model.map').factory('modelMapGraphicAlignmentMarkerService', ['modelMapAlignmentMarkerService',
		function (modelMapAlignmentMarkerService) {
			var service = {};

			function GraphicAlignmentMarkerManager(displayLink, overlayLink, alignmentControllerLink) {
				this._displayLink = displayLink;

				var that = this;
				displayLink.registerRequiresRedraw(function redrawOverlayForDisplay() {
					that.redraw();
				});

				modelMapAlignmentMarkerService.AlignmentMarkerManager.call(this, overlayLink, alignmentControllerLink);
			}

			GraphicAlignmentMarkerManager.prototype = Object.create(modelMapAlignmentMarkerService.AlignmentMarkerManager.prototype);
			GraphicAlignmentMarkerManager.prototype.constructor = GraphicAlignmentMarkerManager;

			GraphicAlignmentMarkerManager.prototype.worldToDisplay = function (x, y) {
				return this._displayLink.graphicToDisplay(x, y);
			};

			GraphicAlignmentMarkerManager.prototype.displayToWorld = function (x, y) {
				return this._displayLink.displayToGraphic(x, y);
			};

			GraphicAlignmentMarkerManager.prototype.zoom = function (x, y, delta) {
				this._displayLink.zoom(x, y, delta / 10000);
			};

			/*
						GraphicAlignmentMarkerManager.prototype.pan = function (sx, sy, ex, ey) {
							this._displayLink.pan(sx, sy, ex, ey);
						};
			*/

			service.createManager = function (displayLink, overlayLink, alignmentControllerLink) {
				var mgr = new GraphicAlignmentMarkerManager(displayLink, overlayLink, alignmentControllerLink);
				return mgr;
			};

			return service;
		}]);
})(angular);
