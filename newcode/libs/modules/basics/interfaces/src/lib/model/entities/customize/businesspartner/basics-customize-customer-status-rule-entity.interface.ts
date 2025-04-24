/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCustomerStatusRuleEntity extends IEntityBase, IEntityIdentification {
	CustomerstatusFk: number;
	CustomerstatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
	AccessrightDescriptorFk: number;
}
