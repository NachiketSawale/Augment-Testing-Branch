/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslatable } from '@libs/platform/common';

/**
 * Used to stored button information
 */
export interface IButtons {
    /**
     * button caption
     */
    caption: ITranslatable | string;

    /**
     * button css class
     */
    cssClass: string;

    /**
     * id
     */
    id: string;

    /**
     * button visibility to show/hide
     */
    visibility: boolean;

}