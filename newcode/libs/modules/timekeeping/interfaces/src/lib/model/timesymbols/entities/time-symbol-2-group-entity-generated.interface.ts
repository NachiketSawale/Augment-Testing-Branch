/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ITimeSymbol2GroupEntityGenerated extends IEntityBase {

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * TimeSymbolFk
   */
  TimeSymbolFk?: number | null;

  /**
   * TimekeepingGroupFk
   */
  TimekeepingGroupFk?: number | null;
}
