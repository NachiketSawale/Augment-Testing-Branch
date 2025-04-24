/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCompanyTransheaderStatusRoleEntity extends IEntityBase, IEntityIdentification {
	CompanyTransheaderStatusRuleFk: number;
	ClerkRoleFk: number;
}
