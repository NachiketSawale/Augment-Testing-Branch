/*
 * Copyright(c) RIB Software GmbH
 */

import { IUpdateItemPriceEntity } from './update-item-price-entity.interface';

export interface IUpdateItemPriceEntityGenerated {

  /**
   * exchangeRate
   */
  exchangeRate: number;

  /**
   * fromFlg
   */
  fromFlg: number;

  /**
   * gridDatas
   */
  gridDatas?: IUpdateItemPriceEntity[] | null;

  /**
   * headerCurrencyFk
   */
  headerCurrencyFk: number;

  /**
   * mainItemId
   */
  mainItemId: number;

  /**
   * projectId
   */
  projectId?: number | null;
}
