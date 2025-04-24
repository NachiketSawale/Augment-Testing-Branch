/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */




import { ICompanyEntity } from './company-entity.interface';

export interface ISyncClientCompany2CustomerEntity {
	Companies?: ICompanyEntity[] | null;
	ExternalCode?: string | null;
	Password?: string | null;
	Url?: string | null;
	UserName?: string | null;
}
