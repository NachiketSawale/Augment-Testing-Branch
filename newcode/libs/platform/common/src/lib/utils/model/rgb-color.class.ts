/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents an RGB(A) color.
 */
export class RgbColor {

	/**
	 * Creates an {@link RgbColor} from an integer ARGB value.
	 * @param argbColor The ARGB color.
	 * @returns The RGB color object.
	 */
	public static fromArgb(argbColor: number): RgbColor {
		const alpha = (argbColor >> 24) & 0xFF;
		const r = (argbColor >> 16) & 0xFF;
		const g = (argbColor >> 8) & 0xFF;
		const b = argbColor & 0xFF;

		return new RgbColor(r, g, b, alpha / 255.0);
	}

	/**
	 * Creates an {@link RgbColor} from an integer RGBA value.
	 * @param rgbaColor The RGBA color.
	 * @returns The RGB color object.
	 */
	public static fromRgba(rgbaColor: number): RgbColor {
		const r = (rgbaColor >> 24) & 0xFF;
		const g = (rgbaColor >> 16) & 0xFF;
		const b = (rgbaColor >> 8) & 0xFF;
		const alpha = rgbaColor & 0xFF;

		return new RgbColor(r, g, b, alpha / 255.0);
	}

	/**
	 * Initializes a new instance.
	 * @param r The red component in the range of 0..255.
	 * @param g The green component in the range of 0..255.
	 * @param b The blue component in the range of 0..255.
	 * @param opacity The opacity in the range of 0..1.
	 */
	public constructor(r: number, g: number, b: number, opacity: number = 1) {
		if (r < 0 || r > 255) {
			throw new Error('The red value exceeds the allowable range.');
		}
		if (g < 0 || g > 255) {
			throw new Error('The green value exceeds the allowable range.');
		}
		if (b < 0 || b > 255) {
			throw new Error('The blue value exceeds the allowable range.');
		}
		if (opacity < 0 || opacity > 1) {
			throw new Error('The opacity value exceeds the allowable range.');
		}

		this.r = r;
		this.g = g;
		this.b = b;
		this.opacity = opacity;
	}

	/**
	 * The red component in the range of 0..255.
	 */
	public readonly r: number;

	/**
	 * The green component in the range of 0..255.
	 */
	public readonly g: number;

	/**
	 * The blue component in the range of 0..255.
	 */
	public readonly b: number;

	/**
	 * The opacity in the range of 0..1.
	 */
	public readonly opacity: number;

	/**
	 * Formats the number as a CSS-compatible color string.
	 * @returns The CSS-compatible color string.
	 */
	public toCssString(): string {
		return `rgba(${this.r},${this.g},${this.b},${this.opacity})`;
	}

	/**
	 * Generates an integer ARGB color value.
	 * @returns The ARGB color.
	 */
	public toArgbColor(): number {
		const alpha = Math.round(this.opacity * 255);
		return (alpha << 24) | (this.r << 16) | (this.g << 8) | this.b;
	}

	/**
	 * Generates an integer RGBA color value.
	 * @returns The RGBA color.
	 */
	public toRgbaColor(): number {
		if(this.opacity !== 1) {
			const alpha = Math.round(this.opacity * 255);
			return (this.r << 24) | (this.g << 16) | (this.b << 8) | alpha;
		}
		return (this.r << 16) | (this.g << 8) | (this.b);
	}

	/**
	 * Returns the luminance of the color.
	 * @returns The computed luminance value.
	 */
	public getLuminance(): number {
		const r = this.r / 255;
		const g = this.g / 255;
		const b = this.b / 255;
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}
}