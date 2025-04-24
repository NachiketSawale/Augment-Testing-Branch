/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticMaterialRateEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialCatalogPriceFk
   */
  MaterialCatalogPriceFk?: number | null;

  /**
   * MaterialFk
   */
  MaterialFk?: number | null;

  /**
   * PricePortion1
   */
  PricePortion1: number;

  /**
   * PricePortion2
   */
  PricePortion2: number;

  /**
   * PricePortion3
   */
  PricePortion3: number;

  /**
   * PricePortion4
   */
  PricePortion4: number;

  /**
   * PricePortion5
   */
  PricePortion5: number;

  /**
   * PricePortion6
   */
  PricePortion6: number;
}
