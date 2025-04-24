/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeModelObjectSetStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ObjectsetstatusruleFk: number;
	ClerkRoleFk: number;
}
