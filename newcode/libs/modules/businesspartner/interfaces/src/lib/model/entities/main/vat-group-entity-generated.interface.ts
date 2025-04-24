/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomerEntity } from './customer-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IVatGroupEntityGenerated extends IEntityBase {

  /**
   * CustomerEntities
   */
  CustomerEntities?: ICustomerEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * Reference
   */
  Reference?: string | null;

  /**
   * Sorting
   */
  Sorting: number;
}
