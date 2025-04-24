/*
 * $Id: color-service.js 528470 2019-01-08 11:03:20Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	var defColors = [
		{
			name: 'blue',
			colors: ['#00529e', '#0064c2', '#0077e6', '#0a89ff', '#2e9aff', '#52abff', '#75bcff', '#99ceff']
		},
		{
			name: 'teal',
			colors: ['#23534f', '#2d6c67', '#38857f', '#429e97', '#4fb5ad', '#68c0b8', '#81cac4', '#9ad5d0']
		},
		{
			name: 'indigo',
			colors: ['#273068', '#313c81', '#3b489b', '#4554b5', '#5c6ac1', '#7682cb', '#9099d5', '#aab1df']
		},
		{
			name: 'red',
			colors: ['#ad000e', '#d10011', '#f50014', '#ff1a2d', '#ff3d4d', '#ff616e', '#ff858f', '#ffa8b0']
		},
		{
			name: 'pink',
			colors: ['#860e4a', '#a6115c', '#c6156e', '#e71880', '#ea3991', '#ee59a3', '#f179b5', '#f499c7']
		},
		{
			name: 'purple',
			colors: ['#5b2565', '#732f7f', '#8a3899', '#a242b3', '#b157c1', '#bd72cb', '#c98cd4', '#d6a6de']
		},
		{
			name: 'green',
			colors: ['#2d622f', '#387a3a', '#439346', '#4fab52', '#65b868', '#7ec480', '#96cf98', '#afdab0']
		},
		{
			name: 'lime',
			colors: ['#788118', '#959f1d', '#b1be23', '#cad82c', '#d1de4a', '#d9e368', '#e1e986', '#e8eea5']
		},
		{
			name: 'yellow',
			colors: ['#cca700', '#f0c400', '#ffd414', '#ffdb38', '#ffe15c', '#ffe880', '#ffeea3', '#fff5c7']
		},
		{
			name: 'orange',
			colors: ['#b35000', '#d66000', '#fa7000', '#ff841f', '#ff9742', '#ffab66', '#ffbe8a', '#ffd2ad']
		},
		{
			name: 'brown',
			colors: ['#4d332d', '#64423a', '#7a5148', '#916055', '#a47065', '#b2857b', '#bf9a92', '#ccafa8']
		},
		{
			name: 'azure',
			colors: ['#1d6395', '#2377b3', '#298bd1', '#449bda', '#61abe0', '#7fbbe6', '#9dcbec', '#bbdbf2']
		},
		{
			name: 'grey',
			colors: ['#434242', '#555353', '#676565', '#797777', '#8b8989', '#9d9b9b', '#aeadad', '#c0bfbf']
		},
		{
			name: 'blue-grey',
			colors: ['#34444b', '#435660', '#526975', '#607c8a', '#728e9d', '#879fab', '#9cb0ba', '#b1c1c9']
		},
		{
			name: 'cyan',
			colors: ['#339699', '#3cb0b4', '#4fc0c4', '#6acacd', '#85d3d6', '#9fdddf', '#bae7e8', '#d5f0f1']
		},
		{
			name: 'light-grey',
			colors: ['#8b8989', '#9d9b9b', '#aeadad', '#c0bfbf', '#d2d1d1', '#e3e3e3', '#f5f5f5', '#ffffff']
		}
	];

	var cssColors = null;
	var hexColors = null;

	/**
	 * @ngdoc service
	 * @name platformColorService
	 * @function platformColorService
	 * @methodOf platformColorService
	 * @description service providing standard color information
	 * @returns {service} newly created service
	 */
	angular.module('platform').factory('platformColorService', platformColorService);

	platformColorService.$inject = ['_'];

	function platformColorService(_) {
		var service = {};

		/**
		 * @ngdoc function
		 * @name hexByName
		 * @function
		 * @methodOf platformColorService
		 * @description provides color value for given color name and index
		 * @param name {string} color name
		 * @param index {integer} index [0..7]
		 * @returns {string} rgb value as #rrggbb
		 */
		service.hexByName = function hexByName(name, index) {
			if (index < 0 || index > 7) {
				throw 'platformColorService: index must be [0..7]';
			}

			var entry = _.find(defColors, function (color) {
				return color.name === name;
			});

			if (entry === -1) {
				throw 'platformColorService: please provide correct name (e.g. blue) - color:' + name + ' not found';
			}

			return entry.colors[index];
		};

		/**
		 * @ngdoc function
		 * @name hexByCss
		 * @function
		 * @methodOf platformColorService
		 * @description provides color value for given css class name
		 * @param cssClass {string} css class name
		 * @returns {string} rgb value as #rrggbb or null if cssClass not found
		 */
		service.hexByCss = function hexByCss(cssClass) {
			_.get(cssColors, cssClass + '.hex', null);
		};

		/**
		 * @ngdoc function
		 * @name cssByHex
		 * @function
		 * @methodOf platformColorService
		 * @description provides color value for given css class name
		 * @param hex {string} css class name
		 * @returns {string} rgb value as #rrggbb
		 */
		service.cssByHex = function cssByHex(hex) {
			_.get(hexColors, hex.toLowerCase(), null);
		};

		/**
		 * @ngdoc function
		 * @name parseColor
		 * @function
		 * @methodOf platformColorService
		 * @description
		 * @param hex {string} hex color value (#001122)
		 * @returns {object} rgb values
		 */
		service.parseColor = function parseColor(hex) {
			var hexMatch = hex.match(/^#((?:[0-9a-f]{3}){1,2})$/i);

			if (hexMatch) {
				hexMatch = hexMatch[1];

				if (hexMatch.length === 3) {
					hexMatch = [
						hexMatch.charAt(0) + hexMatch.charAt(0),
						hexMatch.charAt(1) + hexMatch.charAt(1),
						hexMatch.charAt(2) + hexMatch.charAt(2)
					];
				} else {
					hexMatch = [
						hexMatch.substring(0, 2),
						hexMatch.substring(2, 4),
						hexMatch.substring(4, 6)
					];
				}

				return {
					r: parseInt(hexMatch[0], 16),
					g: parseInt(hexMatch[1], 16),
					b: parseInt(hexMatch[2], 16)
				};
			}

			return null;
		};

		/**
		 * @ngdoc function
		 * @name nearestColor
		 * @function
		 * @methodOf platformColorService
		 * @description returns nearest color for a given color provided as hex string
		 * @param hex {string} color value
		 * @returns {object} object containing matching color value (hex, css, rgb value)
		 */
		service.nearestColor = function nearestColor(hex) {
			hex = service.parseColor(hex);

			if (!hex) {
				return null;
			}

			var distance;
			var minDistance = Infinity;
			var rgb;
			var value = null;

			_.forIn(cssColors, function (color) {
				rgb = color.rgb;

				distance = Math.sqrt(
					Math.pow(hex.r - rgb.r, 2) +
					Math.pow(hex.g - rgb.g, 2) +
					Math.pow(hex.b - rgb.b, 2)
				);

				if (distance < minDistance) {
					minDistance = distance;
					value = color;
				}
			});

			return value;
		};

		/**
		 * @ngdoc function
		 * @name nearestColorHex
		 * @function
		 * @methodOf platformColorService
		 * @description returns nearest color for a given color provided as hex string
		 * @param hex {string} color value
		 * @returns {string} matching color value as hex string
		 */
		service.nearestColorHex = function nearestColorHex(hex) {
			var value = service.nearestColor(hex);

			return value && value.hex;
		};

		/**
		 * @ngdoc function
		 * @name nearestColorCss
		 * @function
		 * @methodOf platformColorService
		 * @description returns nearest color for a given color provided as hex string
		 * @param hex {string} color value
		 * @returns {string} matching color value as css class
		 */
		service.nearestColorCss = function nearestColorCss(hex) {
			var value = service.nearestColor(hex);

			return value && value.css;
		};

		/**
		 * @ngdoc function
		 * @name colors
		 * @function
		 * @methodOf platformColorService
		 * @description returns array of object containing color definition
		 * @returns {object} color definition
		 */
		service.colors = function colors() {
			return defColors;
		};

		/**
		 * @ngdoc function
		 * @name colorsByCss
		 * @function
		 * @methodOf platformColorService
		 * @description returns map containing color definition
		 * @returns {object} color definition
		 */
		service.colorsByCss = function colorsByCss() {
			return cssColors;
		};

		/**
		 * @ngdoc function
		 * @name colorsByHex
		 * @function
		 * @methodOf platformColorService
		 * @description returns map containing color definition
		 * @returns {object} color definition
		 */
		service.colorsByHex = function colorsByHex() {
			return hexColors;
		};

		// convert colors to mappedColors
		cssColors = _.reduce(defColors, function (result, item) {
			for (var i = 0; i < item.colors.length; ++i) {
				var name = item.name + '-' + i;

				_.set(result, name, {
					hex: item.colors[i],
					rgb: service.parseColor(item.colors[i]),
					css: name
				});
			}

			return result;
		}, {});

		hexColors = _.reduce(defColors, function (result, item) {
			for (var i = 0; i < item.colors.length; ++i) {
				_.set(result, item.colors[i], item.name + '-' + i);
			}

			return result;
		}, {});

		return service;
	}
})(angular);