/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBpBankStatusRuleEntity extends IEntityBase, IEntityIdentification {
	BankStatusRuleFk: number;
	ClerkRoleFk: number;
}
