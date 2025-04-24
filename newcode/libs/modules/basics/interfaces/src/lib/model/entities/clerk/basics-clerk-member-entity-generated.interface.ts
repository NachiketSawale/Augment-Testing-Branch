/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsClerkMemberEntityGenerated extends IEntityBase {
	Id: number;
	ClerkFk: number;
	ClerkGroupFk: number;
	FirstName: string;
}
