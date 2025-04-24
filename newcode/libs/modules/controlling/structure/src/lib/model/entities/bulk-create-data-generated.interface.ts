/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitEntity, IControllingUnitGroupEntity } from '../models';

export interface IBulkCreateDataGenerated {

/*
 * ControllingUnit
 */
  ControllingUnit?: IControllingUnitEntity | null;

/*
 * ControllingUnitGroup
 */
  ControllingUnitGroup?: IControllingUnitGroupEntity | null;

/*
 * GroupIds
 */
  GroupIds?: number[] | null;

/*
 * Ids
 */
  Ids?: number[] | null;
}
