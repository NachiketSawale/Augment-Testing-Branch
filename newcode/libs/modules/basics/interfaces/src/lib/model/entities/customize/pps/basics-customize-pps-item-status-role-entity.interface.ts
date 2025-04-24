/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsItemStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ItemStatusruleFk: number;
	ClerkRoleFk: number;
}
