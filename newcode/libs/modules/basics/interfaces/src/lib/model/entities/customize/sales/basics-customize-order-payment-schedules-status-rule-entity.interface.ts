/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeOrderPaymentSchedulesStatusRuleEntity extends IEntityBase, IEntityIdentification {
	PsStatusFk: number;
	PsStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
