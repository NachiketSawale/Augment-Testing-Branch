/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMainStatusRoleEntity extends IEntityBase, IEntityIdentification {
	MaintstatusruleFk: number;
	ClerkRoleFk: number;
}
