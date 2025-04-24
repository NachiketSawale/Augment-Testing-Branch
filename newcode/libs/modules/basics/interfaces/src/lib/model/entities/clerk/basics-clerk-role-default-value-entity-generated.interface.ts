/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsClerkRoleDefaultValueEntityGenerated extends IEntityBase {
	Id: number;
	ClerkFk: number;
	ClerkRoleDefValTypeFk: number;
	ClerkRoleFk: number;
}
