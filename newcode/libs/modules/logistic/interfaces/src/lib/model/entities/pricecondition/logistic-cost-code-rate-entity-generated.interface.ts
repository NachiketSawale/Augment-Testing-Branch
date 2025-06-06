/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticCostCodeRateEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CostCodeFk
   */
  CostCodeFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;

  /**
   * Rate
   */
  Rate: number;

  /**
   * SalesPrice
   */
  SalesPrice: number;
}
