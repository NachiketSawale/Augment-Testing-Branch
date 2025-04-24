/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeOrderPaymentSchedulesStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PsStatusRuleFk: number;
	ClerkRoleFk: number;
}
