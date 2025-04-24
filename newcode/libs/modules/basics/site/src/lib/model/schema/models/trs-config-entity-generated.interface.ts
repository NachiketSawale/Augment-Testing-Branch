/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';

export interface ITrsConfigEntityGenerated {
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  Id?: number;
  IsDefault?: boolean;
  JobFk?: number;
  ProjectFk?: number;
  Remark?: string;
  SiteFk?: number;
  SiteStockFk?: number;
}
