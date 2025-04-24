/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeControllingUnitStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ContrunitstatusruleFk: number;
	ClerkRoleFk: number;
}
