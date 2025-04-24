
/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsClerkGroupEntityGenerated extends IEntityBase {
	Id: number;
	ClerkFk: number;
	ClerkGroupFk: number;
	Department: string
}
