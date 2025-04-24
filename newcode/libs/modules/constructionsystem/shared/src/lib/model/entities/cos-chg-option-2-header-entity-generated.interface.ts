/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosChgOption2HeaderEntityGenerated extends IEntityBase {

  /**
   * CosHeaderFk
   */
  CosHeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsChange
   */
  IsChange: boolean;

  /**
   * IsCopyLineItems
   */
  IsCopyLineItems: boolean;

  /**
   * IsMergeLineItems
   */
  IsMergeLineItems: boolean;
}
