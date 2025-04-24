/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsUpstreamItemStatusRoleEntity extends IEntityBase, IEntityIdentification {
	UpstreamItemStatusRuleFk: number;
	ClerkRoleFk: number;
}
