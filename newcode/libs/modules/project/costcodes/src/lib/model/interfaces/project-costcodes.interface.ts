/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * ProjectCosCodes interface
 */
export interface IProjectCosCodes{
    ExchangeRateMaps:[];
    NewCurrencyFk:number;
    PriceListForUpdate:[];
    Weighting:number;
    ExchangeRate:number;
    Rate:number;
    SalesPrice:number;
    FactorCosts:number;
    FactorQuantity:number;
    RealFactorCosts:number;
    FactorHour:number;
    Co2Project:number;
    Co2Source:number;
    RealFactorQuantity:number;
    MdcPriceListFk:number | null;
    JobCostCodePriceVersionFk:number|null;
    NewRate:number;
    CurrencyFk:number
    NewDayWorkRate:number;
    NewFactorCosts:number;
    NewFactorQuantity:number;
    NewRealFactorCost:number;
    NewRealFactorQuantity:number;
    NewFactorHour:number
    NewCo2Project:number|null;
    NewCo2Source:number|null;
    Status:number

}