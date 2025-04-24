/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { ICompanyTransheaderEntity } from './company-transheader-entity.interface';

export interface ICompanyTransHeaderStatusEntity extends IEntityBase {
	CompanyTransheaderEntities?: ICompanyTransheaderEntity[] | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Icon?: number | null;
	Id?: number | null;
	IsDefault?: boolean | null;
	IsLive?: boolean | null;
	IsReadOnly?: boolean | null;
	IsReadyForAccounting?: boolean | null;
	Sorting?: number | null;
}
