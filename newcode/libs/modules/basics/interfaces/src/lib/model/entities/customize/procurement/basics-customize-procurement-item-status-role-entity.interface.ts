/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementItemStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ItemstatusruleFk: number;
	ClerkRoleFk: number;
}
