/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IStatusHistoryEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * ObjectId
   */
  ObjectId: number;

  /**
   * ObjectPKey1
   */
  ObjectPKey1?: number | null;

  /**
   * ObjectPKey2
   */
  ObjectPKey2?: number | null;

  /**
   * Remark
   */
  Remark: string;

  /**
   * StatusNewFk
   */
  StatusNewFk: number;

  /**
   * StatusOldFk
   */
  StatusOldFk: number;
}
