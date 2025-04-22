/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObjectSet2ObjectEntity } from './object-set-2object-entity.interface';
import { IObjectSetEntity } from './object-set-entity.interface';

export interface IObjectSetWithAssignmentsEntityGenerated {

/*
 * AssignedObjects
 */
  AssignedObjects?: IObjectSet2ObjectEntity[] | null;

/*
 * ObjectSet
 */
  ObjectSet?: IObjectSetEntity | null;
}
