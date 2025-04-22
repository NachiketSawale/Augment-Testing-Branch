/*
 * Copyright(c) RIB Software GmbH
 */

import { IFontItems } from './font-items.interface';

/**
 * used for fonts family options
 */
export interface IFonts {
    /**
     * font display name
     */
    displayName: string;

    /**
     * font family
     */
    fontFamily: string;

    /**
     * font family id
     */
    id?: string;

    /**
     * font options
     */
    items?: IFontItems[];

    /**
     * selected ids
     */
    selectedIds?: string[];

    /**
     * font items with sources
     */
    sources?: IFontItems[]
}