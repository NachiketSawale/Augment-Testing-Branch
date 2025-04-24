/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { ICompanyYearEntity } from './company-year-entity.interface';

export interface ICompanyYearIdentifier {
	TradingPeriod?: number | null;
	TraidingYear?: number | null;
	startDateClient?: string | null;
	year?: ICompanyYearEntity | null;
}
