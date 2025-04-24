/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDispatchRecordStatusRoleEntity extends IEntityBase, IEntityIdentification {
	DspatchrecStatruleFk: number;
	ClerkRoleFk: number;
}
