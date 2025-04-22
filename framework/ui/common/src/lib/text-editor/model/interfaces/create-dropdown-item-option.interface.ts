/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Used to map variable description info with code.
 */
export type PlaceholderToolbarMap = Record<string, string>;

/**
 * Used to stored dropdown items options
 */
export interface ICreateDropdownItemOptionInterface {
    /**
     * id
     */
    id: string;

    /**
     * label
     */
    label: string;

    /**
     * rememberSelection
     */
    rememberSelection: boolean;

    /**
     * variable dropdown items 
     */
    items: PlaceholderToolbarMap;
}