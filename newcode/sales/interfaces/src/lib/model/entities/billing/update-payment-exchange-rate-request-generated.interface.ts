/*
 * Copyright(c) RIB Software GmbH
 */

import { IPaymentEntity } from './payment-entity.interface';

export interface IUpdatePaymentExchangeRateRequestGenerated {

  /**
   * Entity
   */
  Entity?: IPaymentEntity | null;

  /**
   * NewCurrencyId
   */
  NewCurrencyId?: number | null;

  /**
   * NewRate
   */
  NewRate: number;

  /**
   * RemainNet
   */
  RemainNet: boolean;
}
