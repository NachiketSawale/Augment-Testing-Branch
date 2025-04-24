/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialEntityGenerated extends IEntityBase {

  /**
   * AgreementFk
   */
  AgreementFk?: number | null;

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
   * BasCurrencyFk
   */
  BasCurrencyFk?: number | null;

  /**
   * BasRubricCategoryFk
   */
  BasRubricCategoryFk: number;

  /**
   * BasUomPriceUnitFk
   */
  BasUomPriceUnitFk: number;

  /**
   * BasUomWeightFk
   */
  BasUomWeightFk?: number | null;

  /**
   * Blob
   */
  // Blob?: IBlobEntity | null;

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
   * CostPriceGross
   */
  CostPriceGross: number;

  /**
   * DangerClassFk
   */
  DangerClassFk?: number | null;

  /**
   * DayworkRate
   */
  DayworkRate: number;

  /**
   * DescriptionInfo1
   */
  DescriptionInfo1?: IDescriptionInfo | null;

  /**
   * DescriptionInfo2
   */
  DescriptionInfo2?: IDescriptionInfo | null;

  /**
   * Discount
   */
  Discount: number;

  /**
   * EanGtin
   */
  EanGtin?: string | null;

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
   * Id
   */
  Id: number;

  /**
   * IsLabour
   */
  IsLabour?: boolean | null;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsProduct
   */
  IsProduct: boolean;

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
   * MatchCode
   */
  MatchCode?: string | null;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialDiscountGroupFk
   */
  MaterialDiscountGroupFk?: number | null;

  /**
   * MaterialGroupFk
   */
  MaterialGroupFk: number;

  /**
   * MaterialStatusFk
   */
  MaterialStatusFk: number;

  /**
   * MaterialTempFk
   */
  MaterialTempFk?: number | null;

  /**
   * MaterialTempTypeFk
   */
  MaterialTempTypeFk: number;

  /**
   * MaterialTypeFk
   */
  MaterialTypeFk: number;

  /**
   * MdcBrandFk
   */
  MdcBrandFk?: number | null;

  /**
   * MdcMaterial2basUomEntities
   */
  MdcMaterial2basUomEntities?: number[] | null;

  /**
   * MdcMaterial2certificateEntities
   */
  MdcMaterial2certificateEntities?: number[] | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * MdcMaterialReferenceEntities
   */
  MdcMaterialReferenceEntities?: number[] | null;

  /**
   * MdcMaterialStockFk
   */
  MdcMaterialStockFk?: number | null;

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
   * ModelName
   */
  ModelName?: string | null;

  /**
   * NeutralMaterialCatalogFk
   */
  NeutralMaterialCatalogFk?: number | null;

  /**
   * ObsoleteUuid
   */
  ObsoleteUuid?: string | null;

  /**
   * PackageTypeFk
   */
  PackageTypeFk?: number | null;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

  /**
   * PrcPriceconditionFk
   */
  PrcPriceconditionFk?: number | null;

  /**
   * PriceExtra
   */
  PriceExtra: number;

  /**
   * PriceExtraDwRate
   */
  PriceExtraDwRate: number;

  /**
   * PriceExtraEstPrice
   */
  PriceExtraEstPrice: number;

  /**
   * PriceUnit
   */
  PriceUnit: number;

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
   * StockMaterialCatalogFk
   */
  StockMaterialCatalogFk?: number | null;

  /**
   * Supplier
   */
  Supplier?: string | null;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * UomVolumeFk
   */
  UomVolumeFk?: number | null;

  /**
   * UserDefinedDate1
   */
  UserDefinedDate1?: string | null;

  /**
   * UserDefinedDate2
   */
  UserDefinedDate2?: string | null;

  /**
   * UserDefinedDate3
   */
  UserDefinedDate3?: string | null;

  /**
   * UserDefinedDate4
   */
  UserDefinedDate4?: string | null;

  /**
   * UserDefinedDate5
   */
  UserDefinedDate5?: string | null;

  /**
   * UserDefinedNumber1
   */
  UserDefinedNumber1: number;

  /**
   * UserDefinedNumber2
   */
  UserDefinedNumber2: number;

  /**
   * UserDefinedNumber3
   */
  UserDefinedNumber3: number;

  /**
   * UserDefinedNumber4
   */
  UserDefinedNumber4: number;

  /**
   * UserDefinedNumber5
   */
  UserDefinedNumber5: number;

  /**
   * UserDefinedText1
   */
  UserDefinedText1?: string | null;

  /**
   * UserDefinedText2
   */
  UserDefinedText2?: string | null;

  /**
   * UserDefinedText3
   */
  UserDefinedText3?: string | null;

  /**
   * UserDefinedText4
   */
  UserDefinedText4?: string | null;

  /**
   * UserDefinedText5
   */
  UserDefinedText5?: string | null;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * Uuid
   */
  Uuid?: string | null;

  /**
   * Volume
   */
  Volume?: number | null;

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
