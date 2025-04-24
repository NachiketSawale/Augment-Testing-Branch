/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsItemStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	ItemStatusFk: number;
	ItemStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
