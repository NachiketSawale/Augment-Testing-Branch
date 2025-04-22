/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBulkAssignPropertiesItemEntity } from './bulk-assign-properties-item-entity.interface';

export interface IBulkAssignPropertiesEntityGenerated {

/*
 * ObjectIds
 */
  ObjectIds?: string | null;

/*
 * OverwriteValues
 */
  OverwriteValues?: boolean | null;

/*
 * Values
 */
  Values?: IBulkAssignPropertiesItemEntity[] | null;
}
