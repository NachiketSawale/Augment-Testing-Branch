/*
 * Copyright(c) RIB Software GmbH
 */

import {InjectionToken, StaticProvider, Type} from '@angular/core';
import {Orientation} from '@libs/platform/common';
/**
 * The injection token of composite grid container config
 */
export const CompositeGridConfigurationToken = new InjectionToken<ICompositeGridConfiguration>('composite-grid');

/**
 *  composite grid  container configuration
 */

export interface ICompositeGridConfiguration {
    /**
     * The top component max height or The left component max width
     * Defaults to 'auto'
     * Optionally
     */
    readonly maxTopLeftLength?: number;
    /**
     * The top component or left component
     * Optionally
     */
    readonly topLeftContainerType?: Type<unknown>;
    /**
     * The  providers
     * Optionally
     */
    readonly providers?: StaticProvider[];
    /**
     * The bottom component or right component
     * Optionally
     */
    readonly bottomRightContainerType?: Type<unknown>;

    /**
     * The right  component max width or The bottom  component max height
     * Default to 'auto'
     * Optionally
     */
    readonly maxBottomRightLength?: number;
    /**
     * flex direction
     * Default to 'vertical'
     * Optionally
     */
    readonly direction?: Orientation;
}