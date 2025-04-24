/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticMaterialCatalogPriceEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk?: number | null;

  /**
   * MaterialPriceListFk
   */
  MaterialPriceListFk: number;

  /**
   * MaterialPriceVersionFk
   */
  MaterialPriceVersionFk: number;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;
}
