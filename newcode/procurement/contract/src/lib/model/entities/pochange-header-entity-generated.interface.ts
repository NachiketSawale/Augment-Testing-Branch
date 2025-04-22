/*
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity } from '@libs/basics/shared';
import { IPOChangeDeliveryDateEntity } from './pochange-delivery-date-entity.interface';

export interface IPOChangeHeaderEntityGenerated {

  /**
   * addressEntity
   */
  addressEntity?: AddressEntity | null;

  /**
   * changeDeliveryDateDto
   */
  changeDeliveryDateDto?: IPOChangeDeliveryDateEntity | null;

  /**
   * isChangeAddress
   */
  isChangeAddress: boolean;

  /**
   * isChangeDate
   */
  isChangeDate: boolean;
}
