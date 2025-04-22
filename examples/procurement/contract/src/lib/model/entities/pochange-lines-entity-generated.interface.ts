/*
 * Copyright(c) RIB Software GmbH
 */

import { IAddressToItemsEntity } from './address-to-items-entity.interface';
import { IPOChangeItemsEntity } from './pochange-items-entity.interface';

export interface IPOChangeLinesEntityGenerated {

  /**
   * addressToItemsDto
   */
  addressToItemsDto?: IAddressToItemsEntity | null;

  /**
   * changeItemsQtyDto
   */
  changeItemsQtyDto?: IPOChangeItemsEntity | null;

  /**
   * isCancelPO
   */
  isCancelPO: boolean;

  /**
   * isChangeAddress
   */
  isChangeAddress: boolean;

  /**
   * isChangeDate
   */
  isChangeDate: boolean;

  /**
   * isChangeQty
   */
  isChangeQty: boolean;

  /**
   * updateDeliveryDateToItemDto
   */
  // updateDeliveryDateToItemDto?: IUpdateDeliveryDateToItemEntity | null;
}
