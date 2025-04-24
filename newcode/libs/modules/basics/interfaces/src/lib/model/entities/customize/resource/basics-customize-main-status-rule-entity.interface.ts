/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMainStatusRuleEntity extends IEntityBase, IEntityIdentification {
	MaintstatusFk: number;
	MaintstatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
