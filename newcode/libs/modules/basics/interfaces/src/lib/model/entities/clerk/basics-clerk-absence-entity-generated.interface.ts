/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsClerkAbsenceEntityGenerated extends IEntityBase {
	Id: number;
	ClerkFk: number;
	AbsenceFrom: Date;
	AbsenceTo: Date;
	Description: string;
}




