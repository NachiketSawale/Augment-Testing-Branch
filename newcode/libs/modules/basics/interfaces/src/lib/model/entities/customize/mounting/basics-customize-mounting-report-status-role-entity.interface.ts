/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingReportStatusRoleEntity extends IEntityBase, IEntityIdentification {
	RepStatusruleFk: number;
	ClerkRoleFk: number;
}
