/*
 * Copyright(c) RIB Software GmbH
 */

import { IDeliveryScheduleApiEntity } from './delivery-schedule-api-entity.interface';

export interface IContractItemHeaderApiEntityGenerated {

  /**
   * ConfirmedDeliveryDate
   */
  ConfirmedDeliveryDate?: string | null;

  /**
   * ConfirmedQuantity
   */
  ConfirmedQuantity: number;

  /**
   * DeliverySchedules
   */
  DeliverySchedules?: IDeliveryScheduleApiEntity[] | null;

  /**
   * ItemId
   */
  ItemId: number;

  /**
   * ItemNumber
   */
  ItemNumber: number;

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MaterialDescription
   */
  // MaterialDescription?: IDescriptionTranslateType | null;

  /**
   * PlainText
   */
  PlainText?: string | null;

  /**
   * QuantityClaimed
   */
  QuantityClaimed: number;

  /**
   * RequiredDate
   */
  RequiredDate?: string | null;

  /**
   * StatusId
   */
  StatusId: number;
}
