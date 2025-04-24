/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface for Project to Estimate Plant Lookup Data
 */
export interface IPrj2EstPltLookupData {
    /**
     * LGM Job Id
     */
    LgmJobFk?: number | null;

    /**
     * Project Id
     */
    ProjectId?: number | null;

    /**
     * Plant Group Id
     */
    PlantGroupFk?: number | null;

    /**
     * Plant Id
     */
    PlantFk?: number | null;

    /**
     * Plant Estimate Price List Id
     */
    PlantEstimatePriceListFk?: number | null;

    /**
     * Is Plant Group
     */
    IsPlantGroup?: boolean | null;

    /**
     * Search Value
     */
    SearchValue?: string | null;

    /**
     * Field
     */
    Field?: string | null;

    /**
     * Current Page
     */
    CurrentPage?: number | null;

    /**
     * Items Per Page
     */
    ItemsPerPage?: number | null;
}