/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProductionsetEntityGenerated } from './productionset-entity-generated.interface';
import { IPpsEventParentEntity } from '@libs/productionplanning/shared';

export interface IProductionsetEntity extends IProductionsetEntityGenerated, IPpsEventParentEntity {
	LgmJobFk: number;
}
