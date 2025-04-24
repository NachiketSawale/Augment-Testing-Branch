/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
    IProjectMaterialUpdateMaterialPriceByItemPriceList
} from './project-material-update-material-price-by-item-price-list.interface';

export interface IUpdateMaterialPriceByItemEntity{
    Id: number;

    Checked: boolean;

    JobId: number;

    CatalogId: number;

    Variance: number;

    NewPrjEstimatePrice: number;

    CurPrjEstimatePrice: number;

    NewPrjDayworkRate: number;

    CurPrjDayworkRate: number;

    NewPriceUnit: number;

    CurPriceUnit: number;

    NewFactorPriceUnit: number;

    CurFactorPriceUnit: number;

    MaterialId: number;

    NewPrjFactorHour: number;

    CurPrjFactorHour: number;

    IsMaterialPortionChange: boolean;

    Co2Project: number;

    Co2Source: number;

    Co2SourceFk: number;

    Source: string;

    MaterialPriceVersionFk?: number

    CurrencyFk: number;

    PriceList: IProjectMaterialUpdateMaterialPriceByItemPriceList[]
}
