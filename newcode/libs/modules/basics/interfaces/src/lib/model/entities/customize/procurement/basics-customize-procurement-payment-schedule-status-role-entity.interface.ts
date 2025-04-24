/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementPaymentScheduleStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PaymentScheduleStatusRuleFk: number;
	ClerkRoleFk: number;
}
