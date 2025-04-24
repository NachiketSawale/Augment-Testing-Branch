/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICompanyCreditorEntity extends IEntityBase {
	Comment?: string | null;
	CompanyFk?: number | null;
	Id?: number | null;
	SubledgerContextFk?: number | null;
	SupplierFk?: number | null;
	TaxCodeFk?: number | null;
}
