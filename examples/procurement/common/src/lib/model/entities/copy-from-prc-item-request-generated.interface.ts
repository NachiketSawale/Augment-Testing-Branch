/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemPriceConditionEntity } from './prc-item-price-condition-entity.interface';

export interface ICopyFromPrcItemRequestGenerated {

  /**
   * SourceItemId
   */
  SourceItemId: number;

  /**
   * SourceItemPriceConditions
   */
  SourceItemPriceConditions?: IPrcItemPriceConditionEntity[] | null;

  /**
   * TargetItemId
   */
  TargetItemId: number;
}
