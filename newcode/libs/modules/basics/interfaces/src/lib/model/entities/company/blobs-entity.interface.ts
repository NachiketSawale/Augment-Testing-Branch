/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';

export interface IBlobsEntity extends IEntityBase {

	CompanyEntities?: ICompanyEntity[] | null;
	CompanyEntities_BlobsLetterHeaderFk?: ICompanyEntity[] | null;
	Content?: ArrayBuffer | null;
	Id?: number | null;
}
