/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ProductStatusruleFk: number;
	ClerkRoleFk: number;
}
