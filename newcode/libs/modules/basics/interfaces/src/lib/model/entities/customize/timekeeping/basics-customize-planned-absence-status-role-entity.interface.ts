/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlannedAbsenceStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PlannedAbsenceStatusRuleFk: number;
	ClerkRoleFk: number;
}
