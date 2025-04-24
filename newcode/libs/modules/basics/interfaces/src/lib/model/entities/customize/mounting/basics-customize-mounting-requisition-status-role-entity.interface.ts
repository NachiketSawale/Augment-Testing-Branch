/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingRequisitionStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ReqStatusruleFk: number;
	ClerkRoleFk: number;
}
