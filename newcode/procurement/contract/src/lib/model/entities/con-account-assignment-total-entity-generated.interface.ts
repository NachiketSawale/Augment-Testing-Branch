/*
 * Copyright(c) RIB Software GmbH
 */

import { IConAccountAssignmentEntity } from './con-account-assignment-entity.interface';

export interface IConAccountAssignmentTotalEntityGenerated {

  /**
   * conCurrency
   */
  conCurrency?: string | null;

  /**
   * conCurrencyOc
   */
  conCurrencyOc?: string | null;

  /**
   * contractTotalNet
   */
  contractTotalNet: number;

  /**
   * contractTotalNetOc
   */
  contractTotalNetOc: number;

  /**
   * dtos
   */
  dtos?: IConAccountAssignmentEntity[] | null;

  /**
   * totalAmount
   */
  totalAmount: number;

  /**
   * totalAmountOc
   */
  totalAmountOc: number;

  /**
   * totalPercent
   */
  totalPercent: number;
}
