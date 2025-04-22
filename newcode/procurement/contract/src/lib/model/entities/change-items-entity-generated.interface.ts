/*
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity } from '@libs/basics/shared';

export interface IChangeItemsEntityGenerated {

  /**
   * DeliveryScheduleStatusId
   */
  DeliveryScheduleStatusId: number;

  /**
   * IsChangeDeliveryScheduleRequireBy
   */
  IsChangeDeliveryScheduleRequireBy: boolean;

  /**
   * IsChangeItemAddress
   */
  IsChangeItemAddress: boolean;

  /**
   * IsChangeItemRequireBy
   */
  IsChangeItemRequireBy: boolean;

  /**
   * ItemNo
   */
  ItemNo: number;

  /**
   * ItemStatusId
   */
  ItemStatusId: number;

  /**
   * NewDeliveryScheduleRequireBy
   */
  NewDeliveryScheduleRequireBy?: string | null;

  /**
   * NewItemAddress
   */
  NewItemAddress?: AddressEntity | null;

  /**
   * NewItemDateRequired
   */
  NewItemDateRequired?: string | null;

  /**
   * RunningNo
   */
  RunningNo: number;

  /**
   * isAlreadyChangeAddress
   */
  isAlreadyChangeAddress: boolean;
}
