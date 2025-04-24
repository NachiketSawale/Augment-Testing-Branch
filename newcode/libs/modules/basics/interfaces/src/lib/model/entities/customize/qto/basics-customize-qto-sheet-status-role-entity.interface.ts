/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQtoSheetStatusRoleEntity extends IEntityBase, IEntityIdentification {
	SheetStatusRuleFk: number;
	ClerkRoleFk: number;
}
