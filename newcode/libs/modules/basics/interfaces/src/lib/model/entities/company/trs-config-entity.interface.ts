/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';


export interface ITrsConfigEntity extends IEntityBase {
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	Id?: number | null;
	IsDefault?: boolean | null;
	JobFk?: number | null;
	ProjectFk?: number | null;
	Remark?: string | null;
	SiteFk?: number | null;
	SiteStockFk?: number | null;
}
