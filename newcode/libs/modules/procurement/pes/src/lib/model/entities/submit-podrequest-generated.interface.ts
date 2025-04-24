/*
 * Copyright(c) RIB Software GmbH
 */

import { IUpdatedItem } from './updated-item.interface';

export interface ISubmitPODRequestGenerated {

  /**
   * DateDelivered
   */
  DateDelivered: string;

  /**
   * ItemList
   */
  ItemList?: IUpdatedItem[] | null;

  /**
   * PesId
   */
  PesId: number;
}
