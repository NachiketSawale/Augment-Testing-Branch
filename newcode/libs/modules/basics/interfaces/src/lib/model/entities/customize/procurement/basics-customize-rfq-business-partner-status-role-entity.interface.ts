/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRfqBusinessPartnerStatusRoleEntity extends IEntityBase, IEntityIdentification {
	BpStatusRuleFk: number;
	ClerkRoleFk: number;
}
