/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IWorkTimeModelEntity } from './work-time-model-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface ITimeSymbol2WorkTimeModelEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * EvaluatePositiveHour
 */
  EvaluatePositiveHour?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * TimeSymbolFk
 */
  TimeSymbolFk?: number | null;

/*
 * WorkTimeModelEntity
 */
  WorkTimeModelEntity?: IWorkTimeModelEntity | null;

/*
 * WorkingTimeModelFk
 */
  WorkingTimeModelFk?: number | null;
}
