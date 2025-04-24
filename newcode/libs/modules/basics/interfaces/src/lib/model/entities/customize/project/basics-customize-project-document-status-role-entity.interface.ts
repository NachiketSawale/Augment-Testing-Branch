/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectDocumentStatusRoleEntity extends IEntityBase, IEntityIdentification {
	DocumentstatusruleFk: number;
	ClerkRoleFk: number;
}
