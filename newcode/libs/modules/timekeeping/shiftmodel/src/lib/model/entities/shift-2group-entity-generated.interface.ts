/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IShiftEntity } from './shift-entity.interface';

export interface IShift2GroupEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * ShiftEntity
 */
  ShiftEntity?: IShiftEntity | null;

/*
 * ShiftFk
 */
  ShiftFk: number;

/*
 * TimekeepingGroupFk
 */
  TimekeepingGroupFk: number;
}
