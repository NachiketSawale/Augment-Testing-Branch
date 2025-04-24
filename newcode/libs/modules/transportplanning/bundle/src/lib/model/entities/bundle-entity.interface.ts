/*
 * Copyright(c) RIB Software GmbH
 */

import { IBundleEntityGenerated } from './bundle-entity-generated.interface';
import { IPpsEventParentEntity } from '@libs/productionplanning/shared';

export interface IBundleEntity extends IBundleEntityGenerated, IPpsEventParentEntity {
	LgmJobFk: number;
}
