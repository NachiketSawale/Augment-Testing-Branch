/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */



import { ICompanyEntity } from './company-entity.interface';

export interface IMinimalBlobEntity {
	Base64String?: string | null;
	BlobId?: number | null;
	CompanyDto?: ICompanyEntity | null;
}
