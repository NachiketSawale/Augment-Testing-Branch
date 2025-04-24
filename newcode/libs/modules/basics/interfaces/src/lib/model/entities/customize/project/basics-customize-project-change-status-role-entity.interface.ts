/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectChangeStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ChangestatusruleFk: number;
	ClerkRoleFk: number;
}
