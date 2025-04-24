/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';

export interface IActivityCreationDataGenerated {

/*
 * insertActivity
 */
  insertActivity?: boolean | null;

/*
 * lastCode
 */
  lastCode?: string | null;

/*
 * newHierarchy
 */
  newHierarchy?: boolean | null;

/*
 * parentId
 */
  parentId?: number | null;

/*
 * projectId
 */
  projectId?: number | null;

/*
 * scheduleId
 */
  scheduleId?: number | null;

/*
 * selectedActivity
 */
  selectedActivity?: IActivityEntity | null;
}
