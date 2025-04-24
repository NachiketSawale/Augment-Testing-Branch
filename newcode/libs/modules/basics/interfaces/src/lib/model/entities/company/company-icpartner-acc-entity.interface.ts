/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';

export interface ICompanyICPartnerAccEntity extends IEntityBase {

	AccountCost?: string | null;
	AccountRevenue?: string | null;
	AccountRevenueSurcharge?: string | null;
	BasCompanyIcpartnerFk?: number | null;
	Id?: number | null;
	PrcStructureFk?: number | null;
	SurchargePercent?: number | null;
}
