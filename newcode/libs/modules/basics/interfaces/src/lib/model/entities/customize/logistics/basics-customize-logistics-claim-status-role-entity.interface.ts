/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsClaimStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ClaimStatusRuleFk: number;
	ClerkRoleFk: number;
}
