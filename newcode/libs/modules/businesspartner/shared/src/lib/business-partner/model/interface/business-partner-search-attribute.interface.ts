/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Search Filter interface
 */
export interface ISearchFilter {
    IsActive?: boolean;
    SelectedItemsFk?: number[];
    SelectedItemFk?: number;
}


/**
 *  Search Location interface
 */

export interface ISearchLocationFilter extends ISearchFilter {
    IsRegionalActive: boolean;
    AddressElement?: string;
}

/**
 *  Search Evaluation interface
 */
export interface ISearchEvaluationFilter extends ISearchFilter {
    Point?: string;
}

/**
 *  Search Characteristic interface
 */
export interface ISearchCharacteristicFilter extends ISearchFilter {
    HasError?: boolean;
    SelectedOp?: string;
}

/**
 *  Search Status interface
 */
export interface ISearchStatusFilter extends ISearchFilter {
    isApprovedBP?: boolean;
}

/**
 *  Search Grand Total interface
 */
export interface ISearchGrandTotalFilter {
    IsActive?: boolean;
    SelectedOp?: string;
    Total?: number | null;
    isFilterByStructure?: boolean;
}

/**
 *  Search Date Ordered interface
 */
export interface ISearchDateOrderedFilter {
    IsActive?: boolean;
    StartDate?: Date | undefined;
    EndDate?: Date | undefined;
}
