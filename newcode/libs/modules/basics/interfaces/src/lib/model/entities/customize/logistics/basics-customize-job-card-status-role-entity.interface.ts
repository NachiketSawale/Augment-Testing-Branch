/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeJobCardStatusRoleEntity extends IEntityBase, IEntityIdentification {
	JobcardstatusruleFk: number;
	ClerkRoleFk: number;
}
