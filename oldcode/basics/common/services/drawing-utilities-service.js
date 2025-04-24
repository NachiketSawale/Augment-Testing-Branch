(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.common.drawingUtilitiesService
	 * @function
	 * @requires _
	 *
	 * @description Provides some utility routines and types for working with graphics.
	 */
	angular.module('basics.common').factory('basicsCommonDrawingUtilitiesService', ['_', 'd3', '$sanitize',
		function (_, d3, $sanitize) {
			const service = {};

			/**
			 * @ngdoc method
			 * @name RgbColor
			 * @constructor
			 * @methodOf basicsCommonDrawingUtilitiesService
			 * @description Initializes an RGB color. If r, g and b are specified, these represent the channel values of the returned color; an opacity may also be specified. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the HSL color space.
			 * @param {Number} r The red component. A value between 0 and 255.
			 * @param {Number} g The green component. A value between 0 and 255.
			 * @param {Number} b The blue component. A value between 0 and 255.
			 * @param {number} opacity The opacity component. A value between 0 and 1.
			 */
			service.RgbColor = function RgbColor(r, g, b, opacity) {
				const rgb = !_.isUndefined(g) && !_.isUndefined(b) ? d3.rgb(r, g, b, opacity) : d3.rgb(r);

				this.r = rgb.r;
				this.g = rgb.g;
				this.b = rgb.b;
				this.opacity = rgb.opacity;
			};

			/**
			 * @ngdoc method
			 * @name toString
			 * @constructor
			 * @methodOf RgbColor
			 * @description Generates an string that represents the color.
			 * @returns {String} The resulting string.
			 */
			service.RgbColor.prototype.toString = function () {
				return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.opacity + ')';
			};

			/**
			 * @ngdoc method
			 * @name toInt
			 * @constructor
			 * @methodOf RgbColor
			 * @description Generates an Int that represents the color.
			 * @returns {number} The resulting number.
			 */
			service.RgbColor.prototype.toInt = function toInt() {
				return service.rgbColorToInt(this);
			};

			/**
			 * @ngdoc method
			 * @name toHsl
			 * @constructor
			 * @methodOf RgbColor
			 * @description Generates an Int that represents the color.
			 * @returns {object} The resulting HSL object.
			 */
			service.RgbColor.prototype.toHsl = function toHsl() {
				const color = d3.hsl(d3.rgb(this.r, this.g, this.b, this.opacity));
				return new service.HslColor(color.h, color.s, color.l, color.opacity);
			};

			/**
			 * @ngdoc method
			 * @name getLuminance
			 * @constructor
			 * @methodOf RgbColor
			 * @description Generates an Int that represents the luminance of the color.
			 * @returns {number} The resulting number.
			 */
			service.RgbColor.prototype.getLuminance = function getLuminance() {
				const r = this.r / 255;
				const g = this.g / 255;
				const b = this.b / 255;
				return 0.2126 * r + 0.7152 * g + 0.0722 * b;
			};

			/**
			 * @ngdoc method
			 * @name HSLColor
			 * @constructor
			 * @methodOf basicsCommonDrawingUtilitiesService
			 * @description Initializes an HSL color. If h, s and l are specified, these represent the channel values of the returned color; an opacity may also be specified. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the HSL color space.
			 * @param {Number} h The hue component. A value between 0 and 255
			 * @param {Number} s The satuation component. A value between 0 and 1.
			 * @param {Number} l The lightness component. A value between 0 and 1.
			 * @param {number} opacity The opacity compnent. A value between 0 and 1.
			 */
			service.HslColor = function HslColor(h, s, l, opacity) {
				const hsl = !_.isUndefined(s) && !_.isUndefined(l) ? d3.hsl(h, s, l, opacity) : d3.hsl(h);

				this.h = hsl.h;
				this.s = hsl.s;
				this.l = hsl.l;
				this.opacity = hsl.opacity;
			};

			/**
			 * @ngdoc method
			 * @name toString
			 * @constructor
			 * @methodOf HslColor
			 * @description Generates an string that represents the color.
			 * @returns {String} The resulting string.
			 */
			service.HslColor.prototype.toString = function () {
				return 'hsla(' + _.round(this.h) + ',' + _.round(this.s * 100) + '%,' + _.round(this.l * 100) + '%,' + this.opacity + ')';
			};

			const colorStep = 0.15;
			const colorThreshold = 20;

			/**
			 * @ngdoc method
			 * @name darken
			 * @constructor
			 * @methodOf HslColor
			 * @description Returns a darker copy of this color. Lightness is reduced by the passed step value, it defaults to 0.15.
			 * @param {number} step The value by which the lightness should be reduced. Maximum value is 1.
			 * @returns {object} The resulting hsl color.
			 */
			service.HslColor.prototype.darken = function (step) {
				return new service.HslColor(this.h, this.s, (this.l - (_.isNumber(step) ? step : colorStep)), this.opacity);
			};

			/**
			 * @ngdoc method
			 * @name lighten
			 * @constructor
			 * @methodOf HslColor
			 * @description Returns a lighten copy of this color. Lightness is increased by the passed step value, it defaults to 1.
			 * @param {number} step The value by which the lightness should be increased. Maximum value is 1.
			 * @returns {object} The resulting hsl color.
			 */
			service.HslColor.prototype.lighten = function (step) {
				return new service.HslColor(this.h, this.s, (this.l + (_.isNumber(step) ? step : colorStep)), this.opacity);
			};

			/**
			 * @ngdoc method
			 * @name variant
			 * @constructor
			 * @methodOf HslColor
			 * @description Returns a lighten or darken copy of this color depending on the threshold value passed. Lightness is changed by the passed step value, it defaults to 1.
			 * @param {number} threshold The threshold value above which the color should be darkened. Otherwise the color is lightened. Maximum value is 255.
			 * @param {number} step The value by which the lightness should be changed. Maximum value is 1.
			 * @returns {object} The resulting hsl color.
			 */
			service.HslColor.prototype.variant = function (threshold, step) {
				return Math.round(this.h) > (_.isNumber(threshold) ? threshold : colorThreshold) ? this.darken(step) : this.lighten(step);
			};

			/**
			 * @ngdoc method
			 * @name toInt
			 * @constructor
			 * @methodOf RgbColor
			 * @description Generates an Int that represents the color. Opacity isn't supported.
			 * @returns {number} The resulting number.
			 */
			service.HslColor.prototype.toInt = function toInt() {
				const color = service.RgbColor(d3.hsl(this.h, this.s, this.l, this.o));
				return service.rgbColorToInt(color);
			};

			/**
			 * @ngdoc method
			 * @name IntColor
			 * @constructor
			 * @methodOf basicsCommonDrawingUtilitiesService
			 * @description Initializes an Int color. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the Int color space.
			 * @param {object} value The int value.
			 */
			service.IntColor = function IntColor(value) {
				let color;
				if (_.isNumber(value)) {
					this.value = value;
				} else {
					if (!_.isNan(_.toNumber(value))) {
						this.value = _.toNumber(value);
					} else {
						color = d3.rgb(value);
						if (!_.isNaN(color.r) && !_.isNaN(color.g) && !_.isNaN(color.b)) {
							this.value = color.toInt();
						} else {
							this.value = NaN;
						}
					}
				}
			};

			/**
			 * @ngdoc method
			 * @name toString
			 * @constructor
			 * @methodOf IntColor
			 * @description Generates an string that represents the color.
			 * @returns {string} The resulting string.
			 */
			service.IntColor.prototype.toString = function () {
				return this.value.toString();
			};

			/**
			 * @ngdoc method
			 * @name toRgb
			 * @constructor
			 * @methodOf IntColor
			 * @description Generates an RgbColor that represents the color.
			 * @returns {object} The resulting RgbColor.
			 */
			service.IntColor.prototype.toRgb = function toRgb() {
				return service.intToRgbColor(this.value);
			};

			/**
			 * @ngdoc method
			 * @name toHsl
			 * @constructor
			 * @methodOf IntColor
			 * @description Generates an HslColor that represents the color.
			 * @returns {object} The resulting HslColor.
			 */
			service.IntColor.prototype.toHsl = function toRgb() {
				const color = service.intToRgbColor(this.value);
				return color.toHsl();
			};

			/**
			 * @ngdoc method
			 * @name rgbColorToInt
			 * @constructor
			 * @methodOf basicsCommonDrawingUtilitiesService
			 * @description Converts an {@link RgbColor} to an integer representation.
			 * @param {RgbColor} c The color to convert.
			 * @returns {Number} The integer representation.
			 */
			service.rgbColorToInt = function (c) {
				if (c) {
					return (c.r << 16) | (c.g << 8) | c.b;
				} else {
					return 0;
				}
			};

			/**
			 * @ngdoc method
			 * @name intToRgbColor
			 * @constructor
			 * @methodOf basicsCommonDrawingUtilitiesService
			 * @description Converts an integer representation of a color to an {@link RgbColor} object.
			 * @param {Number} c The integer representation.
			 * @returns {RgbColor} The color object.
			 */
			service.intToRgbColor = function (c) {
				return new service.RgbColor((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF);
			};

			/**
			 * @ngdoc method
			 * @name decToHexColor
			 * @constructor
			 * @methodOf basicsCommonDrawingUtilitiesService
			 * @description Converts a decimal representation of a color to a string representation of color in hexadecimal format.
			 * @param {Number} c The decimal representation.
			 * @returns {String} The string representation.
			 */
			service.decToHexColor = (c) => {
				return _.padStart(c.toString(16), 7, '#000000');
			};

			/**
			 * @ngdoc method
			 * @name getSanitizedSvg
			 * @constructor
			 * @methodOf basicsCommonDrawingUtilitiesService
			 * @description Sanitize an SVG graphic
			 * @param {string} svg The SVG string
			 * @param {bool} isBase64 Indicates whether the SVG string should be Base64 decoded or not.
			 * @returns {String} The sanitized SVG string. If base64 is true the string will be base64 encoded.
			 */
			service.getSanitizedSvg = (svg, isBase64) => {
				let finalSvgString = undefined;

				if (svg) {
					const parts = svg.split('base64,');

					if (parts.length > 1) {
						//base64 decoded
						const base64Part = parts[1];
						const decodedString = atob(base64Part);
						finalSvgString = $sanitize(decodedString);
					} else {
						// not decoded
						finalSvgString = $sanitize(svg);
					}

					finalSvgString = finalSvgString.replace(/&#10;/g, ''); //Removes CRLF

					if (isBase64) {
						finalSvgString = 'data:image/svg+xml;base64,' + btoa(finalSvgString);
					}
				}

				return finalSvgString;
			}

			return service;
		}]);
})(angular);
