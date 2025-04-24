/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';

export interface ICompany2CostCodeEntity extends IEntityBase {
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	Contribution?: number | null;
	Extra?: number | null;
   Id?: number | null;
	IsDefault?: boolean | null;
	MdcCostCodeFk?: number | null;
	Rate?: number | null;
	Remark?: string | null;
	Surcharge?: number | null;
}
