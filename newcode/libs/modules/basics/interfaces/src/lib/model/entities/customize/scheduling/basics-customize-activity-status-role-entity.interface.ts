/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeActivityStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ActivitystateruleFk: number;
	ClerkRoleFk: number;
}
