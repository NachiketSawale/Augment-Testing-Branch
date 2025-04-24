/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeObjectUnitStatusRoleEntity extends IEntityBase, IEntityIdentification {
	UnitstatusruleFk: number;
	ClerkRoleFk: number;
}
