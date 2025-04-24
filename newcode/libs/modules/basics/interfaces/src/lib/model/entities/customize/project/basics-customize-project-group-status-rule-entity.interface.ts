/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectGroupStatusRuleEntity extends IEntityBase, IEntityIdentification {
	GroupStatusFk: number;
	GroupStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
