/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectGroupStatusRoleEntity extends IEntityBase, IEntityIdentification {
	GroupStatusRuleFk: number;
	ClerkRoleFk: number;
}
