/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsHeaderStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	HeaderStatusFk: number;
	HeaderStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
