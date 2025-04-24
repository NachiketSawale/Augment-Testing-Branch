/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
export interface IUpdateMaterialPriceByCatalogEntity{
    Id: number;

    Checked: boolean;

    MaterialCatalogFk?: number;

    Variance: number;

    NewPrjEstimatePrice: number;

    CurPrjEstimatePrice: number;

    isProjectMaterial: boolean;

    NewPrjDayworkRate: number;

    CurPrjDayworkRate: number;

    NewPriceUnit: number;

    CurPriceUnit: number;

    NewFactorPriceUnit: number;

    NewPrjFactorHour: number;

    CurPrjFactorHour: number;

    CurFactorPriceUnit: number;

    IsMaterialPortionChange: boolean;

    MaterialPriceVersionFk: number;

    Children: IUpdateMaterialPriceByCatalogEntity[];
}