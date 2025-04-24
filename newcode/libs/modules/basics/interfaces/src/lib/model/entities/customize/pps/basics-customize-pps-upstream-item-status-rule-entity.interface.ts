/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsUpstreamItemStatusRuleEntity extends IEntityBase, IEntityIdentification {
	UpstreamItemStatusFk: number;
	UpstreamItemStatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
