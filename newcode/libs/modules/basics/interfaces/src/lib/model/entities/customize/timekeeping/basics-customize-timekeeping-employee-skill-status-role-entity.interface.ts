/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeSkillStatusRoleEntity extends IEntityBase, IEntityIdentification {
	EmployeeSkillStatusRuleFk: number;
	ClerkRoleFk: number;
}
