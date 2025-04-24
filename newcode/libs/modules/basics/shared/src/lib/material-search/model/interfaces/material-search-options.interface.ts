/*
 * Copyright(c) RIB Software GmbH
 */

import {Type, InjectionToken} from '@angular/core';
import {IMaterialItemOptions} from './material-item-options.interface';

/**
 * Material search component options
 */
export interface IMaterialSearchOptions extends IMaterialItemOptions {
    /**
     * Shopping cart in search bar
     */
    shoppingCartComponent?: Type<unknown>;
    /**
     * Disable create similar material
     */
    isDisableCreateSimilar?: false;
}

/**
 * injection token of material search options
 */
export const MATERIAL_SEARCH_OPTIONS = new InjectionToken<IMaterialSearchOptions>('MATERIAL_SEARCH_OPTIONS');