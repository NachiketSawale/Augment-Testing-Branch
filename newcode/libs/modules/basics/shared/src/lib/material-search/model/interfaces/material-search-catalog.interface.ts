/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

/**
 * Material catalog interface
 */
export interface IMaterialSearchCatalog {
    checked?: boolean;
    Id: number;
    DescriptionInfo: IDescriptionInfo;
    IsFrameworkCatalog: boolean;
    PriceVersions: IMaterialSearchPriceVersion[];
    MaterialPriceVersionFk?: number;
}

/**
 *
 */
export interface IMaterialSearchPriceVersion {
    Id: number
    DescriptionInfo: IDescriptionInfo;
}