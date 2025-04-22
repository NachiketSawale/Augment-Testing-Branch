/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IItemEntity } from '@libs/sales/interfaces';

export class BilItemComplete implements CompleteIdentification<IItemEntity>{

  /**
   * BilItem
   */
  public BilItem?: IItemEntity | null;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PriceConditionToDelete
   */
  //public PriceConditionToDelete?: IItemPriceConditionEntity[] | null = [];

  /**
   * PriceConditionToSave
   */
  //public PriceConditionToSave?: IItemPriceConditionEntity[] | null = [];
}
