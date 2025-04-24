/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsCustomizePriceConditionTypeEntity } from '@libs/basics/interfaces';

export interface IPriceConditionCalcMessageEntityGenerated {

  /**
   * Error
   */
  Error?: string | null;

  /**
   * PriceConditionType
   */
  PriceConditionType?: IBasicsCustomizePriceConditionTypeEntity | null;
}
