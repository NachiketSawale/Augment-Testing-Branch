/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export interface IBasicsClerkForPackageEntityGenerated extends IEntityIdentification {
	ClerkFk: number;
	Clerk2Fk: number;
	ClerkRoleFk: number;
	CommentText: string;
}
