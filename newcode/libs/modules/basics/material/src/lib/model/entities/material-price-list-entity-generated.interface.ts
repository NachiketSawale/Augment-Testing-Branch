/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { IEntityBase } from '@libs/platform/common';

export interface IMaterialPriceListEntityGenerated extends IEntityBase {

  /**
   * BasCo2SourceFk
   */
  BasCo2SourceFk?: number | null;

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
   * Cost
   */
  Cost: number;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * DayworkRate
   */
  DayworkRate: number;

  /**
   * Discount
   */
  Discount: number;

  /**
   * EstimatePrice
   */
  EstimatePrice: number;

  /**
   * Id
   */
  Id: number;

  /**
   * LeadTime
   */
  LeadTime: number;

  /**
   * ListPrice
   */
  ListPrice: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * MaterialPriceVersionFk
   */
  MaterialPriceVersionFk: number;

  /**
   * MinQuantity
   */
  MinQuantity: number;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

  /**
   * PriceExtras
   */
  PriceExtras: number;

  /**
   * PriceListConditions
   */
  PriceListConditions?: IMaterialPriceConditionEntity[] | null;

  /**
   * RetailPrice
   */
  RetailPrice: number;

  /**
   * SellUnit
   */
  SellUnit: number;

  /**
   * Source
   */
  Source?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;
}
