/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingSheetStatusRoleEntity extends IEntityBase, IEntityIdentification {
	SheetStatusRuleFk: number;
	ClerkRoleFk: number;
}
