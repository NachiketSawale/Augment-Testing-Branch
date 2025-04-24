/*
 * Copyright(c) RIB Software GmbH
 */

import { ITransactionContextBaseEntity } from '@libs/procurement/common';

export interface IStockTransactionContextEntity extends ITransactionContextBaseEntity {
	CompanyYearId_Start: number;
	CompanyYearId_End: number;
	CompanyPeriodId_Start: number;
	CompanyPeriodId_End: number;
	EffectiveDate_Start: Date;
	EffectiveDate_End: Date;
}
