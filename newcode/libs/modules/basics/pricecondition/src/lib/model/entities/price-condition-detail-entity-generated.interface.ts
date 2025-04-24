/*
 * Copyright(c) RIB Software GmbH
 */

import { IPriceConditionEntity } from './price-condition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPriceConditionDetailEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * IsActivated
   */
  IsActivated: boolean;

  /**
   * PrcPriceconditionEntity
   */
  PrcPriceconditionEntity?: IPriceConditionEntity | null;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;

  /**
   * PriceConditionTypeFk
   */
  PriceConditionTypeFk: number;

  /**
   * Value
   */
  Value: number;
}
