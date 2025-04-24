/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IProjectMaterialUpdateMaterialPriceByItemPriceList{
    Id: number;
    Checked: boolean;
    MaterialId: number;
    Co2Project: number;
    Co2Source: number;
    Co2SourceFk: number;
    EstimatePrice: number;
    DayworkRate: number;
    FactorHour: number;
    PriceVersionFk: number;
}

export interface IProjectMaterialUpdateMaterialPriceByItemPriceListMap{
    [key: number]: IProjectMaterialUpdateMaterialPriceByItemPriceList[]
}

export interface IProjectMaterialUpdateMaterialPriceByItem2PriceList{
    [key: number]: IProjectMaterialUpdateMaterialPriceByItemPriceList
}