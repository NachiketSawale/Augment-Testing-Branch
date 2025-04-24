/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDispatchStatusRoleEntity extends IEntityBase, IEntityIdentification {
	DispatchStatusruleFk: number;
	ClerkRoleFk: number;
}
