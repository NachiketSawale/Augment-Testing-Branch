/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfiguration2GeneralsEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcLedgerContextFk
   */
  MdcLedgerContextFk?: number | null;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcGeneralsTypeFk
   */
  PrcGeneralsTypeFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * Value
   */
  Value: number;
}
