/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportBundleStatusRoleEntity extends IEntityBase, IEntityIdentification {
	BundleStatusruleFk: number;
	ClerkRoleFk: number;
}
