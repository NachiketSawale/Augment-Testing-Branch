/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticEquipmentCatalogPriceEntityGenerated extends IEntityBase {

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
   * JobFk
   */
  JobFk: number;

  /**
   * JobPerformingFk
   */
  JobPerformingFk?: number | null;
}
