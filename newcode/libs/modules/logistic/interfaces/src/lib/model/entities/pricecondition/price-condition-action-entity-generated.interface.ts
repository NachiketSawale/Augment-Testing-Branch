/*
 * Copyright(c) RIB Software GmbH
 */

import { IPriceConditionEntity } from './price-condition-entity.interface';

export interface IPriceConditionActionEntityGenerated {

  /**
   * Action
   */
  Action: number;

  /**
   * PriceConditions
   */
  PriceConditions?: IPriceConditionEntity[] | null;
}
