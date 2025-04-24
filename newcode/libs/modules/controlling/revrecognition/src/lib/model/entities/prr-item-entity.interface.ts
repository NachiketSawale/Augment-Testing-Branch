/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrrItemEntityGenerated } from './prr-item-entity-generated.interface';

export interface IPrrItemEntity extends IPrrItemEntityGenerated {
	Idx: string;
	PrrItemParentIdx: string;
	Weight: number
}
