/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICompanyTransheaderEntity } from './company-transheader-entity.interface';

export interface ICompanyPeriodEntity extends IEntityBase {
	CompanyTransheaderEntities?: ICompanyTransheaderEntity[] | null;
	/*CompanyYearEntity?: ICompanyYearEntity | null;*/
	CompanyYearFk?: number | null;
	CompanyFk?: number | null;
	EndDate?: string | null;
	Id?: number | null;
	PeriodStatusApFk?: number | null;
	PeriodStatusArFk?: number | null;
	PeriodStatusFk?: number | null;
	PeriodStatusStockFk?: number | null;
	PreliminaryActual?: boolean | null;
	ReadOnlyPreliminaryActual?: boolean | null;
	Remark?: string | null;
	StartDate?: string | null;
	TradingPeriod?: number | null;
	Periods?: ICompanyPeriodEntity | null;
}

