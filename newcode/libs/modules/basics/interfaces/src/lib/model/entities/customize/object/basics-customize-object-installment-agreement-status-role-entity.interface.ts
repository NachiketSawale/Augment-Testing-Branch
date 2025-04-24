/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeObjectInstallmentAgreementStatusRoleEntity extends IEntityBase, IEntityIdentification {
	InstallmentAgreementStateRuleFk: number;
	ClerkRoleFk: number;
}
