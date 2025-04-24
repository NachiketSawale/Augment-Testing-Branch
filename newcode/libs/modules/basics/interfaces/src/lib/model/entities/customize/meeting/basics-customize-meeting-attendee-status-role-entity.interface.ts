/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMeetingAttendeeStatusRoleEntity extends IEntityBase, IEntityIdentification {
	AttendeeStatusRuleFk: number;
	ClerkRoleFk: number;
}
