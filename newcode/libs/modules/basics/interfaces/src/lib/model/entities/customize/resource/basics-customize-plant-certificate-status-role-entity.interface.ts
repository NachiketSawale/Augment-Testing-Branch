/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantCertificateStatusRoleEntity extends IEntityBase, IEntityIdentification {
	CertificateStatusRuleFk: number;
	ClerkRoleFk: number;
}
