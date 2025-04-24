/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDispatchRecordStatusRuleEntity extends IEntityBase, IEntityIdentification {
	DspatchrecStatFk: number;
	DspatchrecStatTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
