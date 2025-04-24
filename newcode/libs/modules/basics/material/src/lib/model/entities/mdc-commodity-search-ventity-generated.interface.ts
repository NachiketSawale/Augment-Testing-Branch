/*
 * Copyright(c) RIB Software GmbH
 */

import { IMdcCommoditySearchVEntity } from './mdc-commodity-search-ventity.interface';
import { IMaterialPriceListEntity } from './material-price-list-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';
import { IBlobStringEntity } from '@libs/basics/shared';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';

export interface IMdcCommoditySearchVEntityGenerated {

  /**
   * AddressLine
   */
  AddressLine?: string | null;

  /**
   * AllPriceConditions
   */
  AllPriceConditions?: IMaterialPriceConditionEntity[] | null;

  /**
   * AlternativeList
   */
  AlternativeList?: IMdcCommoditySearchVEntity[] | null;

  /**
   * BasBlobsFk
   */
  BasBlobsFk?: number | null;

  /**
   * BasBlobsSpecificationFk
   */
  BasBlobsSpecificationFk?: number | null;

  /**
   * BasCo2SourceFk
   */
  BasCo2SourceFk?: number | null;

  /**
   * BasCo2SourceName
   */
  BasCo2SourceName?: string | null;

  /**
   * BasCurrencyFk
   */
  BasCurrencyFk?: number | null;

  /**
   * BasUomFk
   */
  BasUomFk: number;

  /**
   * BasUomPriceUnitFk
   */
  BasUomPriceUnitFk: number;

  /**
   * BasUomWeightFk
   */
  BasUomWeightFk?: number | null;

  /**
   * BlobSpecification
   */
  BlobSpecification?: IBlobStringEntity | null;

  /**
   * BpdBusinesspartnerFk
   */
  BpdBusinesspartnerFk?: number | null;

  /**
   * BpdSupplierFk
   */
  BpdSupplierFk?: number | null;

  /**
   * CatalogCode
   */
  CatalogCode?: string | null;

  /**
   * CatalogDescriptionInfo
   */
  CatalogDescriptionInfo?: IDescriptionInfo | null;

  /**
   * CcFactorHour
   */
  CcFactorHour?: number | null;

  /**
   * Charges
   */
  Charges: number;

  /**
   * Co2Project
   */
  Co2Project?: number | null;

  /**
   * Co2Source
   */
  Co2Source?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * Cost
   */
  Cost: number;

  /**
   * CostCodeCode
   */
  CostCodeCode?: string | null;

  /**
   * CostCodeDescriptionInfo
   */
  CostCodeDescriptionInfo?: IDescriptionInfo | null;

  /**
   * CostCodeIsBudget
   */
  CostCodeIsBudget?: boolean | null;

  /**
   * CostCodeIsCost
   */
  CostCodeIsCost?: boolean | null;

  /**
   * CostCodeTypeIsAllowance
   */
  CostCodeTypeIsAllowance?: boolean | null;

  /**
   * CostCodeTypeIsAm
   */
  CostCodeTypeIsAm?: boolean | null;

  /**
   * CostCodeTypeIsEstimateCc
   */
  CostCodeTypeIsEstimateCc?: boolean | null;

  /**
   * CostCodeTypeIsGa
   */
  CostCodeTypeIsGa?: boolean | null;

  /**
   * CostCodeTypeIsRp
   */
  CostCodeTypeIsRp?: boolean | null;

  /**
   * CurrenctDescriptionInfo
   */
  CurrenctDescriptionInfo?: IDescriptionInfo | null;

  /**
   * Currency
   */
  Currency?: string | null;

  /**
   * DayworkRate
   */
  DayworkRate: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DescriptionInfo2
   */
  DescriptionInfo2?: IDescriptionInfo | null;

  /**
   * Discount
   */
  Discount: number;

  /**
   * DunsNo
   */
  DunsNo?: string | null;

  /**
   * EstCostTypeFk
   */
  EstCostTypeFk?: number | null;

  /**
   * EstimatePrice
   */
  EstimatePrice: number;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * FactorHour
   */
  FactorHour: number;

  /**
   * FactorPriceUnit
   */
  FactorPriceUnit?: number | null;

  /**
   * GroupCode
   */
  GroupCode?: string | null;

  /**
   * GroupDescriptionInfo
   */
  GroupDescriptionInfo?: IDescriptionInfo | null;

  /**
   * HasRfaFile
   */
  HasRfaFile: boolean;

  /**
   * HourUnit
   */
  HourUnit: number;

  /**
   * Id
   */
  Id: number;

  /**
   * InternetCatalogFk
   */
  InternetCatalogFk?: number | null;

  /**
   * IsLabour
   */
  IsLabour?: boolean | null;

  /**
   * IsRate
   */
  IsRate?: boolean | null;

  /**
   * Isticketsystem
   */
  Isticketsystem?: boolean | null;

  /**
   * LeadTime
   */
  LeadTime: number;

  /**
   * LeadTimeExtra
   */
  LeadTimeExtra: number;

  /**
   * ListPrice
   */
  ListPrice: number;

  /**
   * Matchcode
   */
  Matchcode?: string | null;

  /**
   * Material2Uoms
   */
  // Material2Uoms?: IMaterial2UomItems[] | null;

  /**
   * MaterialCatalogIslive
   */
  MaterialCatalogIslive?: boolean | null;

  /**
   * MaterialCatalogSupplier
   */
  MaterialCatalogSupplier?: string | null;

  /**
   * MaterialCatalogTypeFk
   */
  MaterialCatalogTypeFk: number;

  /**
   * MaterialIslive
   */
  MaterialIslive: boolean;

  /**
   * MaterialPriceListFk
   */
  MaterialPriceListFk?: number | null;

  /**
   * MaterialStock2UomFk
   */
  MaterialStock2UomFk?: number | null;

  /**
   * MaterialStockFk
   */
  MaterialStockFk?: number | null;

  /**
   * MaterialTempTypeFk
   */
  MaterialTempTypeFk: number;

  /**
   * Materialname
   */
  Materialname: string;

  /**
   * MdcContextFk
   */
  MdcContextFk?: number | null;

  /**
   * MdcCostCodeFk
   */
  MdcCostCodeFk?: number | null;

  /**
   * MdcMatPriceverFk
   */
  MdcMatPriceverFk?: number | null;

  /**
   * MdcMaterialCatalogFk
   */
  MdcMaterialCatalogFk?: number | null;

  /**
   * MdcMaterialDiscountGroupFk
   */
  MdcMaterialDiscountGroupFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * MdcMaterialGroupFk
   */
  MdcMaterialGroupFk: number;

  /**
   * MdcMaterialabcFk
   */
  MdcMaterialabcFk: number;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * MinQuantity
   */
  MinQuantity: number;

  /**
   * PrcPriceconditionFk
   */
  PrcPriceconditionFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PrcStructureIslive
   */
  PrcStructureIslive?: boolean | null;

  /**
   * PrcStructureMdcCostCodeFk
   */
  PrcStructureMdcCostCodeFk?: number | null;

  /**
   * PrcStructuretypeFk
   */
  PrcStructuretypeFk?: number | null;

  /**
   * PriceConditions
   */
  PriceConditions?: IMaterialPriceConditionEntity[] | null;

  /**
   * PriceExtra
   */
  PriceExtra: number;

  /**
   * PriceLists
   */
  PriceLists?: IMaterialPriceListEntity[] | null;

  /**
   * PriceUnit
   */
  PriceUnit: number;

  /**
   * PriceUnitUomInfo
   */
  PriceUnitUomInfo?: IDescriptionInfo | null;

  /**
   * RealFactorCosts
   */
  RealFactorCosts?: number | null;

  /**
   * RealFactorQuantity
   */
  RealFactorQuantity?: number | null;

  /**
   * Requirequantity
   */
  Requirequantity?: number | null;

  /**
   * RetailPrice
   */
  RetailPrice: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SellUnit
   */
  SellUnit: number;

  /**
   * SpecificationInfo
   */
  SpecificationInfo?: IDescriptionInfo | null;

  /**
   * Supplier
   */
  Supplier?: string | null;

  /**
   * UomDescriptionInfo
   */
  UomDescriptionInfo?: IDescriptionInfo | null;

  /**
   * UomInfo
   */
  UomInfo?: IDescriptionInfo | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * Uuid
   */
  Uuid?: string | null;

  /**
   * Weight
   */
  Weight: number;

  /**
   * WeightNumber
   */
  WeightNumber: number;

  /**
   * WeightType
   */
  WeightType: number;
}
