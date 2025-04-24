/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IProject2MaterialEntityGenerated extends IEntityBase {

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
   * Co2SourceFk
   */
  Co2SourceFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Cost
   */
  Cost: number;

  /**
   * CostTypeFk
   */
  CostTypeFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * DayWorkRate
   */
  DayWorkRate: number;

  /**
   * Discount
   */
  Discount: number;

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
   * JobFk
   */
  JobFk?: number | null;

  /**
   * ListPrice
   */
  ListPrice: number;

  /**
   * MaterialDiscountGrpFk
   */
  MaterialDiscountGrpFk?: number | null;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * MaterialGroupFk
   */
  MaterialGroupFk: number;

  /**
   * PriceConditionFk
   */
  PriceConditionFk?: number | null;

  /**
   * PriceExtra
   */
  PriceExtra: number;

  /**
   * PriceUnit
   */
  PriceUnit: number;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * RetailPrice
   */
  RetailPrice: number;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * UomPriceUnitFk
   */
  UomPriceUnitFk?: number | null;
}
