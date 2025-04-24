/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantSupplyItemStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PlantSupItemStatRuleFk: number;
	ClerkRoleFk: number;
}
