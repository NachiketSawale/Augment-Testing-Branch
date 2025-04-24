/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimeAllocationEntity } from './time-allocation-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ITimeAlloc2PrjActionEntityGenerated extends IEntityBase {

  /**
   * AssignedHours
   */
  AssignedHours?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PrjActionFk
   */
  PrjActionFk: number;

  /**
   * TimeAllocationEntity
   */
  TimeAllocationEntity?: ITimeAllocationEntity | null;

  /**
   * TimeAllocationFk
   */
  TimeAllocationFk: number;
}
