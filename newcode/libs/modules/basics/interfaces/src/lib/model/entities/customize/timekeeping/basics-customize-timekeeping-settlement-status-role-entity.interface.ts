/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingSettlementStatusRoleEntity extends IEntityBase, IEntityIdentification {
	SettlementStatusRuleFk: number;
	ClerkRoleFk: number;
}
