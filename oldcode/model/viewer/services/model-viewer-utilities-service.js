/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerUtilitiesService
	 * @function
	 *
	 * @description Provides some utility routines and types for working with 3D model viewers.
	 */
	angular.module('model.viewer').factory('modelViewerUtilitiesService', ['basicsCommonDrawingUtilitiesService',
		function (drawingUtils) {
			var service = {};

			/**
			 * @ngdoc method
			 * @name RgbColor
			 * @constructor
			 * @methodOf modelViewerUtilitiesService
			 * @description Initializes an RGB color.
			 * @param {Number} r The red component.
			 * @param {Number} g The green component.
			 * @param {Number} b The blue component.
			 */
			service.RgbColor = drawingUtils.RgbColor;

			/**
			 * @ngdoc method
			 * @name rgbColorToInt
			 * @constructor
			 * @methodOf modelViewerUtilitiesService
			 * @description Converts an {@link RgbColor} to an integer representation.
			 * @param {RgbColor} c The color to convert.
			 * @returns {Number} The integer representation.
			 */
			service.rgbColorToInt = drawingUtils.rgbColorToInt;

			/**
			 * @ngdoc method
			 * @name intToRgbColor
			 * @constructor
			 * @methodOf modelViewerUtilitiesService
			 * @description Converts an integer representation of a color to an {@link RgbColor} object.
			 * @param {Number} c The integer representation.
			 * @returns {RgbColor} The color object.
			 */
			service.intToRgbColor = drawingUtils.intToRgbColor;

			/**
			 * @ngdoc method
			 * @name isPartOfViewer
			 * @constructor
			 * @methodOf modelViewerUtilitiesService
			 * @description Checks whether a given DOM element is a part of a 3D viewer.
			 * @param {Object} el The DOM element.
			 * @returns {Boolean} Indicates whether the element belongs to a 3D viewer.
			 */
			service.isPartOfViewer = function (el) {
				if (el) {
					var currentEl;
					for (currentEl = el; currentEl; currentEl = currentEl.parentElement) {
						if (currentEl.attributes['data-is-3d-viewer']) {
							return true;
						}
					}
				}
				return false;
			};

			service.viewerModes = {
				selectedModel: 'selmodel',
				scs: 'scs'
			};

			return service;
		}]);
})(angular);
