/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantWarrantyStatusRoleEntity extends IEntityBase, IEntityIdentification {
	WarrantyStatusRuleFk: number;
	ClerkRoleFk: number;
}
