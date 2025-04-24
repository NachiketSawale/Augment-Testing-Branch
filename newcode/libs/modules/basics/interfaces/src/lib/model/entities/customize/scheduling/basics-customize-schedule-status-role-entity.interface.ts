/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeScheduleStatusRoleEntity extends IEntityBase, IEntityIdentification {
	SchedulestatusruleFk: number;
	ClerkRoleFk: number;
}
