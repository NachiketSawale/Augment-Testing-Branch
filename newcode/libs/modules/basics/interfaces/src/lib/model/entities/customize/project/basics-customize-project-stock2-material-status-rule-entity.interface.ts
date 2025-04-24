/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectStock2MaterialStatusRuleEntity extends IEntityBase, IEntityIdentification {
	Stock2MaterialStatusFk: number;
	CommentText: string;
	HasRoleValidation: boolean;
	Stock2MaterialStatusTargetFk: number;
	AccessrightDescriptorFk: number;
}
