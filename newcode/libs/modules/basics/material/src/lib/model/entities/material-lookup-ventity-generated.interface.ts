/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialLookupVEntityGenerated {

  /**
   * BasCo2SourceFk
   */
  BasCo2SourceFk?: number | null;

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
  BasUomPriceUnitFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * Children
   */
  // Children?: IQtnCon2PrcItemEntity[] | null;

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
   * EstCostTypeFk
   */
  EstCostTypeFk?: number | null;

  /**
   * EstimatePrice
   */
  EstimatePrice: number;

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
   * IsNeutral
   */
  IsNeutral: boolean;

  /**
   * IsRate
   */
  IsRate?: boolean | null;

  /**
   * IsTemplate
   */
  IsTemplate: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * MaterialCatalogCode
   */
  MaterialCatalogCode: string;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialIslive
   */
  MaterialIslive: boolean;

  /**
   * MdcContextFk
   */
  MdcContextFk: number;

  /**
   * MdcCostCodeFk
   */
  MdcCostCodeFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * MdcMaterialGroupFk
   */
  MdcMaterialGroupFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PriceListFk
   */
  PriceListFk: number;

  /**
   * PriceUnit
   */
  PriceUnit: number;

  /**
   * RealFactorCosts
   */
  RealFactorCosts?: number | null;

  /**
   * RealFactorQuantity
   */
  RealFactorQuantity?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * Specification
   */
  Specification?: string | null;

  /**
   * UnitRate
   */
  UnitRate: number;

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
}
