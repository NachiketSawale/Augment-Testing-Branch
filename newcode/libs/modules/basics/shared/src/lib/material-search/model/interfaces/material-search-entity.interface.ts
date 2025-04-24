/*
 * Copyright(c) RIB Software GmbH
 */

import {InjectionToken} from '@angular/core';
import {IDescriptionInfo} from '@libs/platform/common';
import {IMaterialSearchPriceList} from './material-search-price-list.interface';
import {IMaterialSearchPriceCondition} from './material-search-price-condition.interface';
import {IMaterialAlternativeEntity} from './material-alternative-entity.interface';
import { IMaterialSearchDocumentEntity } from './material-search-document-entity.interfact';
import { IMaterialFilterItemAttributes } from '../../../material-filter';

/**
 * Entity type returns from material search http
 */
export interface IMaterialSearchEntity {
    selected: boolean;
    Id: number;
    MdcMaterialCatalogFk: number;
    MdcMatPriceverFk?: number;
    PrcStructureFk?: number;
    BasBlobsFk?: number;
    HasRfaFile: boolean;
    Image: string;
    Code: string;
    DescriptionInfo: IDescriptionInfo;
    DescriptionInfo2: IDescriptionInfo;
    SpecificationInfo: IDescriptionInfo;
    Supplier: string;
    AddressLine: string;
    BasBlobsSpecificationFk?: number;
    LeadTime: number;
    LeadTimeExtra: number;
    PriceForShow: number;
    Cost: number;
    PriceReferenceForShow: number;
    EstimatePrice: number;
    DayworkRate: number;
    PriceUnit: number;
    PriceUnitUomInfo: IDescriptionInfo;
    Currency: string;
    InternetCatalogFk?: number;
    PriceLists: IMaterialSearchPriceList[] | null;
    MaterialPriceListFk?: number;
    PrcPriceconditionFk: number | null;
    MinQuantity: number;
    Requirequantity: number;
    SellUnit: number;
    PriceExtra: number;
    MdcTaxCodeFk?: number;
    RetailPrice: number;
    ListPrice: number;
    Discount: number;
    Charges: number;
    Co2Project?: number;
    Co2Source?: number;
    BasCurrencyFk?: number;
    BasCo2SourceFk?: number;
    BasCo2SourceName: string;
    IsFromFC: boolean;
    UomInfo: IDescriptionInfo;
    PriceConditions: IMaterialSearchPriceCondition[];
    AlternativeList: IMaterialAlternativeEntity[];
    IsAdded: boolean;
    Uuid: string | null;
    BpdBusinesspartnerFk?: number;
    MaterialCatalogTypeFk?: number;
    ShowCost: number;
    FactorPriceUnit: number;
    ExternalCode: string;
    CatalogCode: string;
    CatalogDescriptionInfo: IDescriptionInfo;
    MaterialCatalogSupplier: string;
    BasUomFk: number;
    BasUomPriceUnitFk: number;
    Material2Uoms?: {UomFk: number, Quantity: number}[];
    UserDefined1: string;
    UserDefined2: string;
    UserDefined3: string;
    UserDefined4: string;
    UserDefined5: string;
    MaterialStockFk?: number;
    MaterialStock2UomFk?: number;
    MdcCostCodeFk: number | null;
    EstCostTypeFk: number | null;
    FactorHour: number;
    IsLabour: boolean | null;
    HourUnit?: number | null;
    CostCodeIsBudget: boolean | null;
    CostCodeIsCost: boolean | null;
    CostCodeTypeIsEstimateCc: boolean | null;
    CostCodeTypeIsAllowance: boolean | null;
    CostCodeTypeIsRp: boolean | null;
    CostCodeTypeIsAm: boolean | null;
    CostCodeTypeIsGa: boolean | null;
    IsRate: boolean | null;
	GroupCode: string;
	GroupDescriptionInfo: IDescriptionInfo;
	Matchcode: string;
	MdcMaterialabcFk: number;
	WeightType: number;
	WeightNumber: number;
	Weight: number;
	MaterialTempTypeFk: number;
	MdcMaterialFk?: number | null;
	BasUomWeightFk?: number | null;
	MdcMaterialDiscountGroupFk?: number | null;
	MaterialStatusFk: number;
	PackageTypeFk?: number | null;
	DangerClassFk?: number | null;
	UomVolumeFk?: number | null;
	AgreementFk?: number | null;
	UserDefinedDate1?: Date | null;
	UserDefinedDate2?: Date | null;
	UserDefinedDate3?: Date | null;
	UserDefinedDate4?: Date | null;
	UserDefinedDate5?: Date | null;
	UserDefinedText1: string;
	UserDefinedText2: string;
	UserDefinedText3: string;
	UserDefinedText4: string;
	UserDefinedText5: string;
	UserDefinedNumber1: number;
	UserDefinedNumber2: number;
	UserDefinedNumber3: number;
	UserDefinedNumber4: number;
	UserDefinedNumber5: number;
	Attributes?: IMaterialFilterItemAttributes[] | null,
	Documents?: IMaterialSearchDocumentEntity[] | null,
	Characteristics?: IMaterialFilterItemAttributes[] | null
}

/**
 * injection token of material item
 */
export const MATERIAL_SEARCH_ITEMS = new InjectionToken<IMaterialSearchEntity>('MATERIAL_SEARCH_ITEMS');