/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingActivityStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	ActStatusFk: number;
	ActStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
