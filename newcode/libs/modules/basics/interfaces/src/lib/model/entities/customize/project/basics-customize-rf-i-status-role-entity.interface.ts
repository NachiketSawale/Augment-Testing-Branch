/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRfIStatusRoleEntity extends IEntityBase, IEntityIdentification {
	RfistatusruleFk: number;
	ClerkRoleFk: number;
}
