/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsClerkAbsenceProxyEntityGenerated extends IEntityBase {
	Id: number;
	ClerkAbsenceFk: number;
	ClerkRoleFk: number;
	CompanyFk: number;
	ProjectFk: number;
	ClerkFk: number;
	CommentText: string;
}