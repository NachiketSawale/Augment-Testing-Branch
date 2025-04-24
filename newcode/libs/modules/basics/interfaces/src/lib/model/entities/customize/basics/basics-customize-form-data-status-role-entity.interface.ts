/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeFormDataStatusRoleEntity extends IEntityBase, IEntityIdentification {
	FormdataStatusruleFk: number;
	ClerkRoleFk: number;
}
