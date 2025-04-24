/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringDrawingComponentStatusRoleEntity extends IEntityBase, IEntityIdentification {
	CompStatusruleFk: number;
	ClerkRoleFk: number;
}
