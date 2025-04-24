/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';

export interface IImportContentJobEntity extends IEntityBase {
	BasCompanyFk?: number | null;
	Id?: number | null;
	Status?: number | null;
}
