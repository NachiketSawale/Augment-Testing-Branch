/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItemEntityGenerated } from './pps-item-entity-generated.interface';
import { IPpsEventParentEntity } from '@libs/productionplanning/shared';

export interface IPPSItemEntity extends IPPSItemEntityGenerated, IPpsEventParentEntity {
	LgmJobFk: number;
}
