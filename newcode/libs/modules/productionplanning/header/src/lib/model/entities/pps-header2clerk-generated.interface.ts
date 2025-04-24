/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsHeader2ClerkEntityGenerated extends IEntityBase {
	Id: number;

	PpsHeaderFk: number;

	ClerkRoleFk: number;

	ClerkFk: number;

	ValidFrom?: Date | null;

	ValidTo?: Date | null;

	CommentText: string | null;

	From?: string | null;

}
