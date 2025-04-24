/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCosInstHeaderStatusRoleEntity extends IEntityBase, IEntityIdentification {
	InsheadstateruleFk: number;
	ClerkRoleFk: number;
}
