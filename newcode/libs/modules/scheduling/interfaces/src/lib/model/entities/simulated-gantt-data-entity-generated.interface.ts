/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISimulatedGanttActivityEntity } from './simulated-gantt-activity-entity.interface';

export interface ISimulatedGanttDataEntityGenerated {

/*
 * Activities
 */
  Activities?: ISimulatedGanttActivityEntity[] | null;

/*
 * From
 */
  From?: string | null;

/*
 * To
 */
  To?: string | null;
}
