/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';

export interface IPrcItemdeliveryEntityGenerated extends IEntityBase {

  /**
   * AddressDto
   */
  AddressDto?: IAddressEntity | null;

  /**
   * BasAddressFk
   */
  BasAddressFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DateRequired
   */
  DateRequired: string;

  /**
   * DeliverdateConfirm
   */
  DeliverdateConfirm?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * NewDateRequired
   */
  NewDateRequired?: string | null;

  /**
   * PrcItemFk
   */
  PrcItemFk: number;

  /**
   * PrcItemstatusFk
   */
  PrcItemstatusFk: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * QuantityConfirm
   */
  QuantityConfirm: number;

  /**
   * RunningNumber
   */
  RunningNumber: number;

  /**
   * TimeRequired
   */
  TimeRequired?: string | null;

  /**
   * openQuantity
   */
  openQuantity: number;

  /**
   * quantityScheduled
   */
  quantityScheduled: number;

  /**
   * totalQuantity
   */
  totalQuantity: number;
}
