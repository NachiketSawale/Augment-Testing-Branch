/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimeAllocationStatusRuleEntity extends IEntityBase, IEntityIdentification {
	TimeAllocationStatusFk: number;
	TimeAllocationStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
