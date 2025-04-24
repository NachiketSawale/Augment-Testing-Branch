/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePackageStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PackagestatusruleFk: number;
	ClerkRoleFk: number;
}
