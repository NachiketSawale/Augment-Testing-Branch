/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeJobStatusRoleEntity extends IEntityBase, IEntityIdentification {
	JobstatusruleFk: number;
	ClerkRoleFk: number;
}
