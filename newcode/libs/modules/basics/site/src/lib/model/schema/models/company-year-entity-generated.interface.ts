/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';
import { ICompanyPeriodEntity } from './company-period-entity.interface';

export interface ICompanyYearEntityGenerated {
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  CompanyPeriodEntities?: Array<ICompanyPeriodEntity>;
  EndDate?: string;
  Id?: number;
  PreliminaryActual?: boolean;
  StartDate?: string;
  TradingYear?: number;
}
