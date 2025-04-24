/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';


/**
 * Interface representing an item in a checkbox.
 */
export interface ICheckboxItem {
    /**
     *  Field identifier for the checkbox item.
     */
    field?: Translatable ;

    /**
     * Identifier for the checkbox item.
     */
    id?: number;

    /**
     * Culture or language associated with the checkbox item.
     */
    culture?: Translatable ;

    /**
     * Indicates whether the checkbox item is checked.
     */
    isChecked: boolean;

    /**
     * Text displayed for the checkbox item.
     */
    text: Translatable 
}