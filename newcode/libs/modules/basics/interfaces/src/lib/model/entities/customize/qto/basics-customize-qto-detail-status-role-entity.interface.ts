/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQtoDetailStatusRoleEntity extends IEntityBase, IEntityIdentification {
	DetailStatusRuleFk: number;
	ClerkRoleFk: number;
}
