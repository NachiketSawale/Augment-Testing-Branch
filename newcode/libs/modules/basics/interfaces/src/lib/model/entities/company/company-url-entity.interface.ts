/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';


export interface ICompanyUrlEntity extends IEntityBase {

	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	CompanyUrltypeFk?: number | null;
	EncryptionTypeFk?: number | null;
	Id?: number | null;
	UrlPassword?: string | null;
	UrlUser?: string | null;
	url?: string | null;
}
