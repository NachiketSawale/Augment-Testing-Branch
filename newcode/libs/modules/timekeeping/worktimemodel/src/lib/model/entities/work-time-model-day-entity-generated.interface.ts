/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IWorkTimeModelEntity } from './work-time-model-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IWorkTimeModelDayEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id?: number | null;

/*
 * TargetHours
 */
  TargetHours?: number | null;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;

/*
 * WeekDayIndex
 */
  WeekDayIndex?: number | null;

/*
 * WorkingTimeModelEntity
 */
  WorkingTimeModelEntity?: IWorkTimeModelEntity | null;

/*
 * WorkingTimeModelFk
 */
  WorkingTimeModelFk?: number | null;
}
