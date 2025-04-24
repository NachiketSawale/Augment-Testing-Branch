/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportPackageStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PkgStatusruleFk: number;
	ClerkRoleFk: number;
}
