/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResRequisitionStatusRoleEntity extends IEntityBase, IEntityIdentification {
	RequisitionstatruleFk: number;
	ClerkRoleFk: number;
}
