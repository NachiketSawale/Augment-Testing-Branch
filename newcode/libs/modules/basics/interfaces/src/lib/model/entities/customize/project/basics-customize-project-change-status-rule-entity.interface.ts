/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectChangeStatusRuleEntity extends IEntityBase, IEntityIdentification {
	ChangestatusFk: number;
	ChangestatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
