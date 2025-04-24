/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePeriodStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PeriodStatusruleFk: number;
	ClerkRoleFk: number;
}
