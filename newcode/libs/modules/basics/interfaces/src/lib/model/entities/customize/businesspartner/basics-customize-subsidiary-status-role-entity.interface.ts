/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSubsidiaryStatusRoleEntity extends IEntityBase, IEntityIdentification {
	SubsidiaryStatusRuleFk: number;
	ClerkRoleFk: number;
}
