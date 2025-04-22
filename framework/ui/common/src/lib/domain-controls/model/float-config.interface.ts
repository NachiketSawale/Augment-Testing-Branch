/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

/**
 * Provides fixed configuration options for a floating-point number input box.
 */
export interface IFloatConfig {

	/**
	 * Returns the number of decimal places to display.
	 */
	readonly decimalPlaces: number;
}

export const FloatConfigInjectionToken = new InjectionToken<IFloatConfig>('domain-control-float-config');