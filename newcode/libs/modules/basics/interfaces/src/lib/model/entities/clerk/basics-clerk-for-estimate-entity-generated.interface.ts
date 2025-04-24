/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export interface IBasicsClerkForEstimateEntityGenerated extends IEntityIdentification {
	Id: number;
	ClerkFk: number;
	Clerk2Fk: number;
	ClerkRoleFk: number;
	CommentText: string;
}
