/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ICompanyDeferaltypeEntity extends IEntityBase {
	BasCompanyFk?: number | null;
	CodeFinance?: string | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Id?: number | null;
	IsDefault?: boolean | null;
	IsLive?: boolean | null;
	IsStartDateMandatory?: boolean | null;
	Sorting?: number | null;
	CompanyFk?: number | null;
}
