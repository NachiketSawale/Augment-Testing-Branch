/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from '@libs/boq/interfaces';

export interface IMergedBoqItemInfoGenerated {

  /**
   * BoqItem
   */
  BoqItem?: IBoqItemEntity | null;

  /**
   * MergedFinalPrice
   */
  MergedFinalPrice: number;

  /**
   * MergedFinalPriceOc
   */
  MergedFinalPriceOc: number;
}
