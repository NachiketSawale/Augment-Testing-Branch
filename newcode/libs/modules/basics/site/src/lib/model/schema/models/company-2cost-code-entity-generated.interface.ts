/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';

export interface ICompany2CostCodeEntityGenerated {
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  Contribution?: number;
  Extra?: number;
  Id?: number;
  IsDefault?: boolean;
  MdcCostCodeFk?: number;
  Rate?: number;
  Remark?: string;
  Surcharge?: number;
}
