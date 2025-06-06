/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingActivityStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ActStatusruleFk: number;
	ClerkRoleFk: number;
}
