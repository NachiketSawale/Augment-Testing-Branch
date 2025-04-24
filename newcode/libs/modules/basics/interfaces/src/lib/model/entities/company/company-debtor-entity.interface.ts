/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICompanyDebtorEntity extends IEntityBase {
	Comment?: string | null;
	CompanyFk?: number | null;
	CustomerFk?: number | null;
	Id?: number | null;
	LedgerContextFk?: number | null;
	SubledgerContextFk?: number | null;
	TaxCodeFk?: number | null;
}
