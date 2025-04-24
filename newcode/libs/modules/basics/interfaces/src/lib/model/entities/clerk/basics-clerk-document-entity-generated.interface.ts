/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsClerkDocumentEntityGenerated extends IEntityBase {
	Id: number;
	ClerkFk: number;
	ClerkDocumentTypeFk: number;
	FileArchiveDocFk?: number | null;
	DocumentTypeFk?:number | null;
	Description?:string | null;
	DocumentDate?: string | null;
	OriginFileName?: string | null;
}
