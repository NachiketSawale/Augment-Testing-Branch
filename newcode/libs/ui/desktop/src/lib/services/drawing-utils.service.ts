/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as d3 from 'd3';

@Injectable({
	providedIn: 'root',
})

/**
 * Provides some utility routines and types for working with graphics.
 */
export class DrawingUtilsService {
	opacity!: number;
	colorStep = 0.15;
	colorThreshold = 20;

	constructor() {}
	/**
	 * Initializes an RGB color. If r, g and b are specified, these represent the channel values of the returned color; an opacity may also be specified. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the HSL color space.
	 * @param {Number} r The red component. A value between 0 and 255.
	 * @param {Number} g The green component. A value between 0 and 255.
	 * @param {Number} b The blue component. A value between 0 and 255.
	 * @param {number} opacity The opacity component. A value between 0 and 1.
	 * @return {object}
	 */
	RgbColor(r: string | number, g: number, b: number, opacity: number): d3.RGBColor {
		const rgb = !_.isUndefined(g) && !_.isUndefined(b) ? d3.rgb(parseInt(r.toString()), g, b, opacity) : d3.rgb(r.toString());
		r = rgb.r;
		g = rgb.g;
		b = rgb.b;
		this.opacity = rgb.opacity;
		return rgb;
	}

	/**
	 * Generates an Int that represents the color.
	 * @returns {object} The resulting HSL object.
	 */
	toHsl(r: number, g: number, b: number, opacity: number): d3.HSLColor {
		const color = d3.hsl(d3.rgb(r, g, b, opacity));
		return this.HslColor(color.h, color.s, color.l, color.opacity);
	}

	/**
	 * Initializes an HSL color. If h, s and l are specified, these represent the channel values of the returned color; an opacity may also be specified. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the HSL color space.
	 * @param {Number} h The hue component. A value between 0 and 255
	 * @param {Number} s The satuation component. A value between 0 and 1.
	 * @param {Number} l The lightness component. A value between 0 and 1.
	 * @param {number} opacity The opacity compnent. A value between 0 and 1.
	 * @return {object}
	 */
	HslColor(h: number, s: number, l: number, opacity: number): d3.HSLColor {
		const hsl = !_.isUndefined(s) && !_.isUndefined(l) ? d3.hsl(h, s, l, opacity) : d3.hsl(h.toString());
		h = hsl.h;
		s = hsl.s;
		l = hsl.l;
		this.opacity = hsl.opacity;
		return hsl;
	}

	toHslString(h: number, s: number, l: number, opacity: number) {
		return 'hsla(' + _.round(h) + ',' + _.round(s * 100) + '%,' + _.round(l * 100) + '%,' + opacity + ')';
	}
	/**
	 * Returns a darker copy of this color. Lightness is reduced by the passed step value, it defaults to 0.15.
	 * @param {Number} h The hue component. A value between 0 and 255
	 * @param {Number} s The satuation component. A value between 0 and 1.
	 * @param {Number} l The lightness component. A value between 0 and 1.
	 * @param {number} opacity The opacity compnent. A value between 0 and 1
	 * @param {number} step The value by which the lightness should be reduced. Maximum value is 1.
	 * @returns {object} The resulting hsl color.
	 */
	darken(h: number, s: number, l: number, opacity: number, step: number): d3.HSLColor {
		return this.HslColor(h, s, l - (_.isNumber(step) ? step : this.colorStep), opacity);
	}
	/**
	 * Returns a lighten copy of this color. Lightness is increased by the passed step value, it defaults to 1.
	 * @param {Number} h The hue component. A value between 0 and 255
	 * @param {Number} s The satuation component. A value between 0 and 1.
	 * @param {Number} l The lightness component. A value between 0 and 1.
	 * @param {number} opacity The opacity compnent. A value between 0 and 1
	 * @param {number} step The value by which the lightness should be increased. Maximum value is 1.
	 * @returns {object} The resulting hsl color.
	 */
	lighten(h: number, s: number, l: number, opacity: number, step: number) {
		return this.HslColor(h, s, l + (_.isNumber(step) ? step : this.colorStep), opacity);
	}
	/**
	 * Returns a lighten or darken copy of this color depending on the threshold value passed. Lightness is changed by the passed step value, it defaults to 1.
	 * @param {Number} h The hue component. A value between 0 and 255
	 * @param {Number} s The satuation component. A value between 0 and 1.
	 * @param {Number} l The lightness component. A value between 0 and 1.
	 * @param {number} opacity The opacity compnent. A value between 0 and 1
	 * @param {number} threshold The threshold value above which the color should be darkened. Otherwise the color is lightened. Maximum value is 255.
	 * @param {number} step The value by which the lightness should be changed. Maximum value is 1.
	 * @returns {object} The resulting hsl color.
	 */
	variant(h: number, s: number, l: number, opacity: number, threshold: string, step: string): d3.HSLColor {
		return Math.round(h) > (_.isNumber(threshold) ? threshold : this.colorThreshold) ? this.darken(h, s, l, opacity, parseInt(step)) : this.lighten(h, s, l, opacity, parseInt(step));
	}
	/**
	 * Initializes an Int color. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the Int color space.
	 * @param {object} value The int value.
	 * @return {string}
	 */
	IntColor(value: string | number): string {
		let color;
		if (_.isNumber(value)) {
			value = value;
		} else {
			if (!_.isNaN(_.toNumber(value))) {
				value = _.toNumber(value);
			} else {
				color = d3.rgb(value);
				if (!_.isNaN(color.r) && !_.isNaN(color.g) && !_.isNaN(color.b)) {
					value = color.toString();
				} else {
					value = NaN;
				}
			}
		}

		const colorGet = this.toRgb(parseInt(value.toString()));
		const getHslColor = this.toHsl(colorGet.r, colorGet.g, colorGet.b, colorGet.opacity);
		const variationData = this.variant(getHslColor.h, getHslColor.s, getHslColor.l, getHslColor.opacity, '', '');
		return this.toHslString(variationData.h, variationData.s, variationData.l, variationData.opacity);
	}
	/**
	 * Generates an RgbColor that represents the color.
	 * @param {number} c The value in number
	 * @returns {object} The resulting RgbColor.
	 */
	toRgb(c: number): d3.RGBColor {
		return this.RgbColor((c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff, this.opacity);
	}

	/**
	 * Converts an integer representation of a color to an {@link RgbColor} object.
	 * @param {Number} c The integer representation.
	 * @returns {RgbColor} The color object.
	 */
	intToRgbColor(c: number, opacity: number): d3.RGBColor {
		return this.RgbColor((c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff, opacity);
	}
}
