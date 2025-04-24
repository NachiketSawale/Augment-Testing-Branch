/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingPeriodStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PeriodStatusRuleFk: number;
	ClerkRoleFk: number;
}
