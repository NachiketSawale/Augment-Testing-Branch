/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsClerkForScheduleEntityGenerated extends IEntityBase {
	Id: number;
	ClerkFk: number;
	Clerk2Fk: number;
	ClerkRoleFk: number;
	CommentText: string;
}
