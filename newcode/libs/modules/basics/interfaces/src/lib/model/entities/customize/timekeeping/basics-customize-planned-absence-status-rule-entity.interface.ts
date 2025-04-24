/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlannedAbsenceStatusRuleEntity extends IEntityBase, IEntityIdentification {
	PlannedAbsenceStatusFk: number;
	PlannedAbsenceStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
