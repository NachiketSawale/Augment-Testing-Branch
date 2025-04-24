/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IScheduleEntity } from './schedule-entity.interface';
import { ISmallActivityEntity } from './small-activity-entity.interface';

export interface IScheduleExtendedEntityGenerated {

/*
 * Activities
 */
  Activities?: ISmallActivityEntity[] | null;

/*
 * Schedule
 */
  Schedule?: IScheduleEntity | null;
}
