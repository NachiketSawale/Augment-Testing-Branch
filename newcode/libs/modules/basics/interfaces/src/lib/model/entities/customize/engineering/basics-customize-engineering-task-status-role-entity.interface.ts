/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringTaskStatusRoleEntity extends IEntityBase, IEntityIdentification {
	TaskStatusruleFk: number;
	ClerkRoleFk: number;
}
