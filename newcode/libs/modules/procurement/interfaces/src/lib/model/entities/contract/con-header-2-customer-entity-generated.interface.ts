/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IConHeaderEntity } from './con-header-entity.interface';

export interface IConHeader2customerEntityGenerated extends IEntityBase {

  /**
   * BpdBusinesspartnerFk
   */
  BpdBusinesspartnerFk: number;

  /**
   * BpdCustomerFk
   */
  BpdCustomerFk?: number | null;

  /**
   * BpdSubsidiaryFk
   */
  BpdSubsidiaryFk?: number | null;

  /**
   * ConHeaderEntity
   */
  ConHeaderEntity?: IConHeaderEntity | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk: number;

  /**
   * ConStatusFk
   */
  ConStatusFk: number;

  /**
   * Id
   */
  Id: number;
}
