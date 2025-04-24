/*
 * Copyright(c) RIB Software GmbH
 */

import { ICostGroupCatEntityGenerated } from './cost-group-cat-entity-generated.interface';

export interface ICostGroupCatEntity extends ICostGroupCatEntityGenerated {
	Sorting: number;

	PRJCostGrpCatAssignId: number;
}
