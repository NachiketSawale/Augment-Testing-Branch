/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBil2WipEntityGenerated extends IEntityBase {

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * WipHeaderFk
   */
  WipHeaderFk: number;
}
