/*
 * Copyright(c) RIB Software GmbH
 */


export interface IFilters {
    /**
     * Indicates whether untranslated items are included in the export.
     */
    untranslated: boolean;

    /**
     * Indicates whether the export includes changed items
     */
    changed: boolean;

    /**
     * Indicates whether resource remarks are included in the export.
     */
    resourceRemark: boolean;

    /**
     * Indicates whether translation remarks are included in the export.
     */
    translationRemark: boolean;

    /**
     * Indicates whether categories are included in the export.
     */
    addCategory: boolean;

    /**
     * Indicates whether resource paths are included in the export.
     */
    path: boolean;

    /**
     * Indicates whether resource parameter information is included in the export.
     */
    parameterInfo: boolean;

    /**
     * Array of checkbox categories.
     */
    categories: number[];
}
