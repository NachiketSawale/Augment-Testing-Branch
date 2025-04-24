/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PlantstatusruleFk: number;
	ClerkRoleFk: number;
}
