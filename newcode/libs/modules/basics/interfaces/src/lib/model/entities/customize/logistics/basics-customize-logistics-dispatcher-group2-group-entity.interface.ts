/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsDispatcherGroup2GroupEntity extends IEntityBase, IEntityIdentification {
	DispatcherGroupFk: number;
	DispatcherGroupToFk: number;
	CommentText: string;
}
