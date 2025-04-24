/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.map.modelMapAlignmentMarkerService
	 * @function
	 *
	 * @description Provides a class that manages map alignment markers.
	 */
	angular.module('model.map').factory('modelMapAlignmentMarkerService',
		modelMapAlignmentMarkerService);
	modelMapAlignmentMarkerService.$inject = ['_'];

	function modelMapAlignmentMarkerService(_) {
		const service = {};

		function Marker(type, id, x, y) {
			this._type = type;
			this._id = id;
			this._x = x;
			this._y = y;
		}

		service.Marker = Marker;

		function AlignmentMarkerManager(overlayLink, alignmentControllerLink) {
			const that = this;

			that._overlayLink = overlayLink;
			that._alignmentControllerLink = alignmentControllerLink;

			that._overlayLink.setInteractionListener({
				moveMarker: function (id, x, y) {
					const actualHit = that.displayToWorld(x, y);
					if (that.moveMarker)
						that.moveMarker(id, actualHit.x, actualHit.y);
				},
				zoom: function (x, y, delta) {
					if (that.zoom)
						that.zoom(x, y, delta);
				},
				pan: function (sx, sy, ex, ey) {
					if (that.pan)
						that.pan(sx, sy, ex, ey);
				}
			});

			this._markersById = {};

			updateMarkers.call(this);
		}

		service.AlignmentMarkerManager = AlignmentMarkerManager;

		AlignmentMarkerManager.prototype.loadMarkers = function (markers) {
			const that = this;

			that._markersById = {};
			if (_.isArray(markers)) {
				markers.forEach(function (m) {
					that._markersById[m._id] = m;
				});
			}
		};

		AlignmentMarkerManager.prototype.worldToDisplay = function () {
			throw new Error('This method must be overridden by a subclass.');
		};

		AlignmentMarkerManager.prototype.displayToWorld = function () {
			throw new Error('This method must be overridden by a subclass.');
		};

		function updateMarkers() {
			const that = this; // jshint ignore:line

			that._overlayLink.updateMarkers(_.map(Object.keys(that._markersById), function (key) {
				const m = that._markersById[key];
				const pt = that.worldToDisplay(m._x, m._y);
				return {
					id: key,
					type: m._type,
					x: pt.x,
					y: pt.y
				};
			}));
		}

		AlignmentMarkerManager.prototype.moveMarker = function (markerId, x, y) {
			const m = this._markersById[markerId];
			if (!m) {
				throw new Error('Unknown marker: ' + markerId);
			}

			m._x = x;
			m._y = y;
			m._invalidated = true;

			updateMarkers.call(this);

			this._alignmentControllerLink.moveMarker(markerId, x, y);
		};

		AlignmentMarkerManager.prototype.zoom = function (/* x, y, delta */) {
			throw new Error('This method must be overridden by a subclass.');
		};

		/*
					AlignmentMarkerManager.prototype.pan = function (sx, sy, ex, ey) {
						throw new Error('This method must be overridden by a subclass.');
					};
		*/

		AlignmentMarkerManager.prototype.redraw = function () {
			updateMarkers.call(this);
		};

		const refMarkerIdPattern = /^ref([0-9]+)$/;
		service.getReferenceMarkerIndexFromId = function (markerId) {
			const match = markerId.match(refMarkerIdPattern);
			if (match) {
				return parseInt(match[1]);
			}
			return null;
		};

		return service;
	}
})(angular);
