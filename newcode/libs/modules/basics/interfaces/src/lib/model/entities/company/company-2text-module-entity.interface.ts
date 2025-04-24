/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';

export interface ICompany2TextModuleEntity extends IEntityBase {
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	Id?: number | null;
	LanguageFk?: number | null;
	TextModuleFk?: number | null;
	TextModuleTypeFk?: number | null;
}
