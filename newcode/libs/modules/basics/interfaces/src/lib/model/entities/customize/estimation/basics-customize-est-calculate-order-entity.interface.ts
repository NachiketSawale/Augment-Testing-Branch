/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstCalculateOrderEntity extends IEntityBase, IEntityIdentification {
	Operation: string;
	IsCostTotal: boolean;
	SortOrder: number;
}
