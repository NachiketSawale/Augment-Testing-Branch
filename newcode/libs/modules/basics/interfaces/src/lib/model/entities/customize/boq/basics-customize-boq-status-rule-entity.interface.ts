/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBoqStatusRuleEntity extends IEntityBase, IEntityIdentification {
	StatusFk: number;
	StatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
