/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSubsidiaryStatusRuleEntity extends IEntityBase, IEntityIdentification {
	SubsidiaryStatusFk: number;
	SubsidiaryStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
