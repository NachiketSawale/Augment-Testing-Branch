/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeHsqeChecklistStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ChlStatusRuleFk: number;
	ClerkRoleFk: number;
}
