/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeControllingUnitStatusRuleEntity extends IEntityBase, IEntityIdentification {
	ContrunitstatusFk: number;
	ContrunitstatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
