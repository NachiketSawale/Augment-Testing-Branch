/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticEquipCatalogPriceEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * EquipmentPriceListFk
   */
  EquipmentPriceListFk: number;

  /**
   * EvaluationOrder
   */
  EvaluationOrder: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;
}
