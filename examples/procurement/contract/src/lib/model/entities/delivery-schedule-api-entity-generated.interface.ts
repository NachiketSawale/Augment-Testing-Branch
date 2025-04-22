/*
 * Copyright(c) RIB Software GmbH
 */

export interface IDeliveryScheduleApiEntityGenerated {

  /**
   * ConfirmedDeliveryDate
   */
  ConfirmedDeliveryDate?: string | null;

  /**
   * ConfirmedQuantity
   */
  ConfirmedQuantity: number;

  /**
   * Id
   */
  Id: number;

  /**
   * QuantityClaimed
   */
  QuantityClaimed: number;

  /**
   * RequiredDate
   */
  RequiredDate: string;

  /**
   * RequiredTime
   */
  RequiredTime?: string | null;

  /**
   * StatusId
   */
  StatusId: number;

  /**
   * UOM
   */
  UOM?: string | null;
}
