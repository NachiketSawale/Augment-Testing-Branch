/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Interface for Plant2 Estimate Entity
 */
export interface IPlant2EstimateEntity {
    /**
     * Id
     */
    Id: number;

    /**
     * Unit of Measure Id
     */
    UoMFk: number;

    /**
     * Plant Status Id
     */
    PlantStatusFk: number;

    /**
     * Plant Group Id
     */
    PlantGroupFk: number;

    /**
     * Plant Type Id
     */
    PlantTypeFk: number;

    /**
     * Is Live
     */
    IsLive: boolean;

    /**
     * Code
     */
    Code: string;

    /**
     * Description Info
     */
    DescriptionInfo: IDescriptionInfo;

    /**
     * Rubric Category Id
     */
    RubricCategoryFk: number;

    /**
     * Search Pattern
     */
    SearchPattern: string;

    /**
     * Company Id
     */
    CompanyFk?: number;

    /**
     * Plant Pricing Group Id
     */
    PlantPricingGroupFk?: number;

    /**
     * Equipment Group Id
     */
    EquipmentGroupFk?: number;

    /**
     * Sub Groups
     */
    SubGroups?: IPlant2EstimateEntity[];

    /**
     * Pricing Group Id
     */
    PricingGroupFk?: number;

    /**
     * Is Plant Group
     */
    IsPlantGroup: boolean;

    /**
     * Original Id
     */
    OriginalId: number;

    /**
     * Original Parent Id
     */
    OriginalParentId?: number;

    /**
     * Plant Estimate Price List Id
     */
    PlantEstimatePriceListFk: number;
}
