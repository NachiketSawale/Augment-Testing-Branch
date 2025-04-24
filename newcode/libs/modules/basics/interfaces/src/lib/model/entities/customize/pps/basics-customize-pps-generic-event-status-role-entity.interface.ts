/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsGenericEventStatusRoleEntity extends IEntityBase, IEntityIdentification {
	GenericEventStatusRuleFk: number;
	ClerkRoleFk: number;
}
