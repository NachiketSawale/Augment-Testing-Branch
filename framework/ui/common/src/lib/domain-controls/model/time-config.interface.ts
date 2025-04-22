/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { FieldType } from '../../model/fields';

/**
 * Provides fixed configuration options for TimeComponent to provide FieldType.
 */
export interface ITimeConfig {
	/**
	 * Returns the FieldType.
	 */
	readonly type: FieldType.Time | FieldType.TimeUtc;
}

export const TimeConfigInjectionToken = new InjectionToken<ITimeConfig>('domain-control-time-config');
