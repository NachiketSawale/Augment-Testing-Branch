/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBillStatusRuleEntity extends IEntityBase, IEntityIdentification {
	StatusFk: number;
	StatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
