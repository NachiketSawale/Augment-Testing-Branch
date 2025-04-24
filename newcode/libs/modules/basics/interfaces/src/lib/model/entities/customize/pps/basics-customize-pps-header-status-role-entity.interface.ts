/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsHeaderStatusRoleEntity extends IEntityBase, IEntityIdentification {
	HeaderStatusruleFk: number;
	ClerkRoleFk: number;
}
