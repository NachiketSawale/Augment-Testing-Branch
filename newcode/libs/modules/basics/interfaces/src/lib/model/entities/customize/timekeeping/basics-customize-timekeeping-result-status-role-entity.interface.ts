/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingResultStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ResultStatusRuleFk: number;
	ClerkRoleFk: number;
}
