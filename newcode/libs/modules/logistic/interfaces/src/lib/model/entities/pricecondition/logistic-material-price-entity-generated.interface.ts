/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticMaterialPriceEntityGenerated extends IEntityBase {

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
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * Price
   */
  Price: number;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;

  /**
   * Uom
   */
  Uom?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
