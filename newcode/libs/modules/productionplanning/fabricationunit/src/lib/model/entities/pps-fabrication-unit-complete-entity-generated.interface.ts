/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsFabricationUnitEntity } from './pps-fabrication-unit-entity.interface';
import { IPpsNestingEntity } from './pps-nesting-entity.interface';

export interface IPpsFabricationUnitCompleteEntityGenerated {
  FabricationUnits?: Array<IPpsFabricationUnitEntity>;
  MainItemId?: number;
  NestingToDelete?: Array<IPpsNestingEntity>;
  NestingToSave?: Array<IPpsNestingEntity>;
}
