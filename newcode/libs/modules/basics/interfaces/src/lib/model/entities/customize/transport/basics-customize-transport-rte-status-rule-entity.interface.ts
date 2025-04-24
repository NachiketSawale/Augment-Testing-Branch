/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportRteStatusRuleEntity extends IEntityBase, IEntityIdentification {
	RteStatusFk: number;
	RteStatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
