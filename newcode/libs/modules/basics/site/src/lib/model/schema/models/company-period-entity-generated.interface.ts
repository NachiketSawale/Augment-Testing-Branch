/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyTransheaderEntity } from './company-transheader-entity.interface';
import { ICompanyYearEntity } from './company-year-entity.interface';

export interface ICompanyPeriodEntityGenerated {
  CompanyTransheaderEntities?: Array<ICompanyTransheaderEntity>;
  CompanyYearEntity?: ICompanyYearEntity;
  CompanyYearFk?: number;
  EndDate?: string;
  Id?: number;
  PeriodStatusApFk?: number;
  PeriodStatusArFk?: number;
  PeriodStatusFk?: number;
  PeriodStatusStockFk?: number;
  PreliminaryActual?: boolean;
  ReadOnlyPreliminaryActual?: boolean;
  Remark?: string;
  StartDate?: string;
  TradingPeriod?: number;
  Year?: ICompanyYearEntity;
}
