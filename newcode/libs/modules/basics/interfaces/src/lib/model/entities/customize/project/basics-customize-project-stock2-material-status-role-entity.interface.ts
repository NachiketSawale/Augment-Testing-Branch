/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectStock2MaterialStatusRoleEntity extends IEntityBase, IEntityIdentification {
	Stock2MaterialStatusRuleFk: number;
	ClerkRoleFk: number;
}
