/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeObjectProspectStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ProspectstatusruleFk: number;
	ClerkRoleFk: number;
}
