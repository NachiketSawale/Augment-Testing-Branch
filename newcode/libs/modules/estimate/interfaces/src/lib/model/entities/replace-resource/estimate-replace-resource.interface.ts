/*
 * Copyright(c) RIB Software GmbH
 */

export interface EstimateReplaceResource{
    estimateScope?: number,
    FunctionTypeFk: number;
    ResourceTypeId: number;
    EstHeaderFk?: number;
    ToBeReplacedFk?: number;
}