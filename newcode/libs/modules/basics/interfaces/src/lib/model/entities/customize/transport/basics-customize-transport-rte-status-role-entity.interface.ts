/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportRteStatusRoleEntity extends IEntityBase, IEntityIdentification {
	RteStatusruleFk: number;
	ClerkRoleFk: number;
}
