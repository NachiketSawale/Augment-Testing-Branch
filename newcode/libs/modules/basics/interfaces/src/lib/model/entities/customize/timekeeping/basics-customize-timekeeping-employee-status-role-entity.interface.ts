/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeStatusRoleEntity extends IEntityBase, IEntityIdentification {
	EmployeeStatusRuleFk: number;
	ClerkRoleFk: number;
}
