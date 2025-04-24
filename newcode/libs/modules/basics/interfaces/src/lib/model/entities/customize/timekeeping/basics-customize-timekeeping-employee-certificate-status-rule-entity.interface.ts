/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeCertificateStatusRuleEntity extends IEntityBase, IEntityIdentification {
	EmployeeCertificateStatusRuleFk: number;
	ClerkRoleFk: number;
}
