/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Qto Detail Boq Calculate Info
 */
export interface IQtoDetailBoqCalculateInfo {
    Id: number;
    IsBlocked: boolean;
    BoqHeaderFk: number;
    BoqItemFk: number;
    IsWQ: boolean;
    IsAQ: boolean;
    IsIQ: boolean;
    IsBQ: boolean;
    WipHeaderFk?: number;
    PesHeaderFk?: number;
    OrdHeaderFk?: number;
    BilHeaderFk?: number;
    QtoLineTypeFk: number;
    Result: number;
    BoqSplitQuantityFk?: number;
}