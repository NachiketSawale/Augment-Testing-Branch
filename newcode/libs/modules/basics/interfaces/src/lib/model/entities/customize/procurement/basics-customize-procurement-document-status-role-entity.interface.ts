/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementDocumentStatusRoleEntity extends IEntityBase, IEntityIdentification {
	DocumentStatusRuleFk: number;
	ClerkRoleFk: number;
}
