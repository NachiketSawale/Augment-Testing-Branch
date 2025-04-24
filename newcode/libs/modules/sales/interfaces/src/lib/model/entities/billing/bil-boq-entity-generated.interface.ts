/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBilBoqEntityGenerated extends IEntityBase {

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * HeaderEntity
   */
  HeaderEntity?: IBilHeaderEntity | null;

  /**
   * Id
   */
  Id: number;
}
