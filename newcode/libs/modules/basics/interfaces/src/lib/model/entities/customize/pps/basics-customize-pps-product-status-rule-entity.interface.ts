/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductStatusRuleEntity extends IEntityBase, IEntityIdentification {
	ProductStatusFk: number;
	ProductStatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
