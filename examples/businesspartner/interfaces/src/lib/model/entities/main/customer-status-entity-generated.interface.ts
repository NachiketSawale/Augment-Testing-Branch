/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomerEntity } from './customer-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICustomerStatusEntityGenerated extends IEntityBase {

  /**
   * AccountingValue
   */
  AccountingValue?: string | null;

  /**
   * CustomerEntities
   */
  CustomerEntities?: ICustomerEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDeactivated
   */
  IsDeactivated: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
