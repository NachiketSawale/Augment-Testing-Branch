/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeStatusRuleEntity extends IEntityBase, IEntityIdentification {
	EmployeeStatusFk: number;
	EmployeeStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
