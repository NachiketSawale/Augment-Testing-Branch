/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringStatusRoleEntity extends IEntityBase, IEntityIdentification {
	StatusruleFk: number;
	ClerkRoleFk: number;
}
