/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * SaveCopyOptionsRequest
 */
export interface SaveCopyOptionsRequest {
    EstHeaderId?: number;
    EstCopyOptionData?: SaveCopyOptionsRequestData;
}

/**
 * Save CopyOptions Request data
 */
export interface SaveCopyOptionsRequestData {
    CopyResourcesTo: number;
    LiQuantity?: boolean;
    LiQuantityFactors?: boolean;
    LiCostFactors?: boolean;
    LiBudget?: boolean;
    LiResources?: boolean;
    LiPackageItemAssignment?: boolean;
    LiCharacteristics?: boolean;
    LiBoq?: boolean;
    LiActivity?: boolean;
    LiControllingUnit?: boolean;
    LiCostGroup?: boolean;
    LiPrjCostGroup?: boolean;
    LiProcurementStructure?: boolean;
    LiLocation?: boolean;
    LiWicBoq?: boolean;
    ResQuantity?: boolean;
    ResCostUnit?: boolean;
    ResQuantityFactors?: boolean;
    ResCostFactors?: boolean;
    ResPackageItemAssignment?: boolean;
    ResCharacteristics?: boolean;
}
