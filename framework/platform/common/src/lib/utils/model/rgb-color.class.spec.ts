/*
 * Copyright(c) RIB Software GmbH
 */

import { RgbColor } from './rgb-color.class';

describe('RgbColor', () => {
	it('should create', () => {
		const cl = new RgbColor(0, 0, 0);
		expect(cl).toBeTruthy();
	});

	it('should retain values', () => {
		const r = 23;
		const g = 84;
		const b = 202;
		const opacity = 0.8;

		const cl = new RgbColor(r, g, b, opacity);
		expect(cl.r).toBe(r);
		expect(cl.g).toBe(g);
		expect(cl.b).toBe(b);
		expect(cl.opacity).toBe(opacity);
	});

	it('should create from ARGB', () => {
		const cl = RgbColor.fromArgb(0xe75d85b8);
		expect(cl.r).toBe(0x5D);
		expect(cl.g).toBe(0x85);
		expect(cl.b).toBe(0xB8);
		expect(cl.opacity).toBeCloseTo(0xE7 / 255, 5);
	});

	it('should create from RGBA', () => {
		const cl = RgbColor.fromRgba(0xd41311c0);
		expect(cl.r).toBe(0xD4);
		expect(cl.g).toBe(0x13);
		expect(cl.b).toBe(0x11);
		expect(cl.opacity).toBeCloseTo(0xC0 / 255, 5);
	});

	it('should generate CSS string', () => {
		const cl = new RgbColor(29, 119, 6, 0.72);
		const css = cl.toCssString();
		expect(css).toBe('rgba(29,119,6,0.72)');
	});

	it('should generate ARGB color', () => {
		const cl = new RgbColor(167, 84, 244, 5 / 100);
		const argb = cl.toArgbColor();
		expect(argb).toBe(0x0da754f4);
	});

	it('should generate RGBA color', () => {
		const cl = new RgbColor(55, 14, 21, 30 / 100);
		const rgba = cl.toRgbaColor();
		expect(rgba).toBe(0x370e154d);
	});
});