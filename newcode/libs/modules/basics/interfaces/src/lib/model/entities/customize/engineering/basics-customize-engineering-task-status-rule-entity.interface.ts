/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringTaskStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	TaskStatusFk: number;
	TaskStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
