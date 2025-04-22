/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAssignedUoMIdEntity } from './assigned-uo-mid-entity.interface';

export interface IUoMAssignmentEntityGenerated {

/*
 * mode
 */
  mode?: 'None' | 'PropertyKey' | 'ValueType' | 'Global' | null;

/*
 * uom
 */
  uom?: string | null;

/*
 * uomIds
 */
  uomIds?: IAssignedUoMIdEntity[] | null;
}
