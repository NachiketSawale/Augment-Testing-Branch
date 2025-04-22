/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IUoMAssignmentEntity } from './uo-massignment-entity.interface';

export interface IAssignPropertyUoMsRequestEntityGenerated {

/*
 * ignoreAssignedUoM
 */
  ignoreAssignedUoM?: boolean | null;

/*
 * keys
 */
  keys?: number[] | null;

/*
 * modelId
 */
  modelId?: number | null;

/*
 * uom
 */
  uom?: IUoMAssignmentEntity[] | null;
}
