/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMaterialPortionEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

  /**
   * CostPerUnit
   */
  CostPerUnit: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDayworkRate
   */
  IsDayworkRate: boolean;

  /**
   * IsEstimatePrice
   */
  IsEstimatePrice: boolean;

  /**
   * MaterialPortionTypeFk
   */
  MaterialPortionTypeFk?: number | null;

  /**
   * MdcCostCodeFk
   */
  MdcCostCodeFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk: number;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

  /**
   * PriceExtra
   */
  PriceExtra: number;

  /**
   * Quantity
   */
  Quantity?: number | null;
}
