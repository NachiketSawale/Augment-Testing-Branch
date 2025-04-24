/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringDrawingStatusRoleEntity extends IEntityBase, IEntityIdentification {
	DrwStatusruleFk: number;
	ClerkRoleFk: number;
}
