/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCosInstHeaderStatusRuleEntity extends IEntityBase, IEntityIdentification {
	InsheadstateFk: number;
	InsheadstateTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
