/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeSkillStatusRuleEntity extends IEntityBase, IEntityIdentification {
	EmployeeSkillStatusFk: number;
	EmployeeSkillStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
