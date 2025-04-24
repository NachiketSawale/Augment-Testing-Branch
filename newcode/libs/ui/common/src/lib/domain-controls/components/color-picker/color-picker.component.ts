/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { ColorFormat, ColorType, RgbColor } from '@libs/platform/common';
import { IColorControlContext } from '../../model/color-control-context.interfacets';

/**
 * Represents a UI control to select a color.
 */
@Component({
	selector: 'ui-common-color-picker',
	templateUrl: './color-picker.component.html',
	styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent extends DomainControlBaseComponent<ColorType, IColorControlContext> {
	/**
	 * Represenet the prefix color code char
	 */
	private readonly prefixColorChar = '#';
	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	/**
	 * @returns {ColorFormat} Represent the Color Format like RGB, RGBA , ARGB
	 */
	private get effectiveColorFormat(): ColorFormat {
		return this.controlContext.format ?? ColorFormat.RgbColor;
	}

	/**
	 * @returns {string | undefined}  Retrieves the current value converted to an RGBA color string.
	 */
	public get value(): string | undefined {
		if (this.controlContext.value === undefined) {
			return undefined;
		}

		switch (this.effectiveColorFormat) {
			case ColorFormat.RgbColor:
				return this.prefixColorChar + (this.controlContext.value as RgbColor).toRgbaColor().toString(16);
			case ColorFormat.RgbaValue:
				return this.prefixColorChar + (this.controlContext.value as number).toString(16);
			case ColorFormat.ArgbValue:
				return (
					this.prefixColorChar +
					RgbColor.fromArgb(this.controlContext.value as number)
						.toRgbaColor()
						.toString(16)
				);
		}
	}

	/**
	 * Sets the current value as an RGBA color string.
	 *
	 * @param {string | undefined} rawValue The raw value as a string.
	 */
	public set value(rawValue: string | undefined) {
		if (rawValue) {
			if (typeof rawValue === 'string') {
				const newVal = parseInt(rawValue?.replace(this.prefixColorChar, ''), 16);
				if (Number.isInteger(newVal)) {
					switch (this.effectiveColorFormat) {
						case ColorFormat.RgbColor:
							this.controlContext.value = RgbColor.fromRgba(newVal);
							break;
						case ColorFormat.RgbaValue:
							this.controlContext.value = newVal;
							break;
						case ColorFormat.ArgbValue:
							this.controlContext.value = RgbColor.fromRgba(newVal).toArgbColor();
							break;
					}
				}
			} else {
				this.controlContext.value = rawValue;
			}
		} else {
			this.controlContext.value = undefined;
		}
	}

	/**
	 * This is function used for control context value set undefined
	 */
	public clearColor(): void {
		this.controlContext.value = undefined;
	}
}
