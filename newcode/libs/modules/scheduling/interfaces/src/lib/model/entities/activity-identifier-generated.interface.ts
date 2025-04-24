/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';

export interface IActivityIdentifierGenerated {

/*
 * Activity
 */
  Activity?: IActivityEntity | null;

/*
 * PerformanceDescription
 */
  PerformanceDescription?: string | null;

/*
 * PerformanceDueDate
 */
  PerformanceDueDate?: string | null;

/*
 * mainItemId
 */
  mainItemId?: number | null;
}
