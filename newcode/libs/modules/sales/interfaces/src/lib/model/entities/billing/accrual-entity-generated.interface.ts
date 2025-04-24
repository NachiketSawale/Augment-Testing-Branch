/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IAccrualEntityGenerated extends IEntityBase {

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * CompanyTransaction
   */
  //CompanyTransaction?: ICompanyTransactionEntity | null;

  /**
   * CompanyTransactionFk
   */
  CompanyTransactionFk: number;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * Id
   */
  Id: number;
}
