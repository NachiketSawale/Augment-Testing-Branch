/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSpatialGeometryConnectorBaseService
	 * @function
	 *
	 * @description Represents the base class for connectors to display spatial geometry.
	 */
	angular.module('model.viewer').factory('modelViewerSpatialGeometryConnectorBaseService', [
		function () {
			function SpatialGeometryConnector(viewer, name) {
				this._viewer = viewer;
				this._name = name;
			}

			SpatialGeometryConnector.prototype.initialize = function () {
			};

			SpatialGeometryConnector.prototype.finalize = function () {
			};

			SpatialGeometryConnector.prototype.defineGeometry = function (/*id, geometryDef*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			SpatialGeometryConnector.prototype.addObject = function (/*id, geometryDefLink, options*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			SpatialGeometryConnector.prototype.removeObject = function (/*objectLink*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			SpatialGeometryConnector.prototype.setTransform = function (/*objectLink, transform*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			SpatialGeometryConnector.prototype.setStrokeColor = function (/*objectLink, color, isSelected*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			SpatialGeometryConnector.prototype.setFillColor = function (/*objectLink, color, isSelected*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			SpatialGeometryConnector.prototype.setSelected = function (/*objectLink, isSelected, strokeColor, fillColor*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			SpatialGeometryConnector.prototype.setVisible = function (/*objectLink, isVisible*/) {
				throw new Error('This function must be implemented by a subclass.');
			};

			return SpatialGeometryConnector;
		}]);
})(angular);
