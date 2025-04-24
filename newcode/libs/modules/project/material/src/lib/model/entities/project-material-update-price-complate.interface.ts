/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IUpdatePriceDataComplete {
    basicOption?: IBaseOptionItem;
    priceResultSet?: IPriceResult[]
}

export interface IBaseOptionItem {
    optionItem : IUpdatePriceBasicOption;
}

export interface IUpdatePriceBasicOption {
    canUpdateFromCatalog?: boolean;
    catalogSelect?: string;
    radioSelect?: string;
}

export interface IPriceResult{
    Id: number;
    Checked: boolean;
    CatalogCode: string;
    UomFk:number;
    Uom:number;
    Comment: string;
    CommentText: string;
    PriceConditionFk:number;
    PriceConditions: object;
    Variance: number;
    OldEstimatePrice: number;
}

export interface IPriceCondition{
    Id: number;
    PriceConditionFk: number;
    PriceConditions: object;
}

export interface IPrjMat2SourceOption{
    [key: number]: number;
}

export interface ICalculatePriceWithWeightResultEntity{
    EstimatePrice: number;
    DayworkRate: number;
    Weighting: number;
    FactorHour?: number;
}

export interface IUpdatePricesFromCatalogResultEntity{
    NewPrjEstimatePrice: number;
    NewPrjFactorHour: number;
    Id: number
}

export interface IBaseMaterialPriceOfQuoteNContrat{
    Id: number;

    Checked: boolean;

    ProjectFk: number;

    StatusFk: number;

    BusinessPartnerFk: number;

    Description:string;

    Co2Project: number;

    OldCo2Project: number;

    Co2Source: number;

    OldCo2Source: number;

    Variance: number;

    NewEstimatePrice: number;

    Comment: string;

    MaterialCode: string;
}
