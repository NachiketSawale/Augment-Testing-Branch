/*
 * Copyright(c) RIB Software GmbH
 */

import {Translatable} from '@libs/platform/common';

/**
 * Popup menu item interface
 */
export interface IPopupMenuItem {
    /**
     * Identifier
     */
    id: string;
    /**
     * Description
     */
    description: Translatable;
    /**
     * Sort value
     */
    sort?: number,
    /**
     * append divider after itself
     */
    appendDivider?: boolean;
    /**
     * Shown as divider
     */
    divider?: boolean;
    /**
     * Icon css class
     */
    icon?: string;
    /**
     * Disabled
     */
    disabled?: boolean;
    /**
     * Handler
     */
    execute?: () => void;
    /**
     * Sub menu items.
     */
    subItems?: IPopupMenuItem[]
}