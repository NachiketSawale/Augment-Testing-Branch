/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimeAllocationStatusRoleEntity extends IEntityBase, IEntityIdentification {
	TimeAllocationStatusRuleFk: number;
	ClerkRoleFk: number;
}
