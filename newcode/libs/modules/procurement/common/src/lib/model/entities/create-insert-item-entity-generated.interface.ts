/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemEntity } from './prc-item-entity.interface';



export interface ICreateInsertItemEntityGenerated {

  /**
   * InsertBefore
   */
  InsertBefore: boolean;

  /**
   * PrcItems
   */
  PrcItems?: IPrcItemEntity[] | null;

  /**
   * SelectedItem
   */
  SelectedItem?: IPrcItemEntity | null;
}
