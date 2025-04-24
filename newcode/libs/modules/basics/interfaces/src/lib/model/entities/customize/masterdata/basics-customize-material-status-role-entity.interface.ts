/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMaterialStatusRoleEntity extends IEntityBase, IEntityIdentification {
	MaterialStatusRuleFk: number;
	ClerkRoleFk: number;
}
