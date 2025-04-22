/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { FieldType } from '../../model/fields';

/**
 * Provides fixed configuration options for a date-picker input box.
 */
export interface IDateConfig {

    /**
     * Returns field type as date or date-utc.
     */
    readonly type: FieldType.Date | FieldType.DateUtc;
}

export const DateConfigInjectionToken = new InjectionToken<IDateConfig>('domain-control-date-config');