/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductionSetRoleEntity extends IEntityBase, IEntityIdentification {
	ProductionSetStatusRuleFk: number;
	ClerkRoleFk: number;
}
