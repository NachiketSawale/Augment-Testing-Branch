/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';

export interface IRescheduleUncompleteTasksEntityGenerated {

/*
 * Activities
 */
  Activities?: IActivityEntity[] | null;

/*
 * IsEntireSchedule
 */
  IsEntireSchedule?: boolean | null;

/*
 * StartDate
 */
  StartDate?: string | null;
}
