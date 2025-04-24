/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IBilStatusEntity } from './bil-status-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IStatusHistoryEntityGenerated extends IEntityBase {

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilStatusEntity_StatusNewFk
   */
  BilStatusEntity_StatusNewFk?: IBilStatusEntity | null;

  /**
   * BilStatusEntity_StatusOldFk
   */
  BilStatusEntity_StatusOldFk?: IBilStatusEntity | null;

  /**
   * HeaderFk
   */
  HeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * StatusNewFk
   */
  StatusNewFk: number;

  /**
   * StatusOldFk
   */
  StatusOldFk: number;
}
