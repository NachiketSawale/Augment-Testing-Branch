/*
 * Copyright(c) RIB Software GmbH
 */

import {InjectionToken} from '@angular/core';

export const PLAIN_TEXT_ACCESSOR = new InjectionToken<IPlainTextAccessor<unknown>>('PLAIN_TEXT_ACCESSOR');

/**
 * Plain text accessor interface.
 */
export interface IPlainTextAccessor<T> {
    /**
     * Getter
     * @param entity
     */
    getText(entity: T): string | undefined;

    /**
     * Setter
     * @param entity
     * @param value
     */
    setText(entity: T, value?: string): void;
}