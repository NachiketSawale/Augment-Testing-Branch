/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyCostDataEntity } from './company-cost-data-entity.interface';
import { ICompanyCostHeaderEntity } from './company-cost-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface ICompanyCostHeaderEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyCostDataEntities
 */
  CompanyCostDataEntities?: ICompanyCostDataEntity[] | null;

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * CompanyPeriod
 */
  // CompanyPeriod?: ICompanyPeriodEntity | null;

/*
 * CompanyPeriodFk
 */
  CompanyPeriodFk?: number | null;

/*
 * CompanyPeriodFkEndDate
 */
  CompanyPeriodFkEndDate?: string | null;

/*
 * CompanyPeriodFkStartDate
 */
  CompanyPeriodFkStartDate?: string | null;

/*
 * CompanyYear
 */
  // CompanyYear?: ICompanyYearEntity | null;

/*
 * CompanyYearFk
 */
  CompanyYearFk?: number | null;

/*
 * CompanyYearFkEndDate
 */
  CompanyYearFkEndDate?: string | null;

/*
 * CompanyYearFkStartDate
 */
  CompanyYearFkStartDate?: string | null;

/*
 * ControllingActualsCostHeader
 */
  ControllingActualsCostHeader?: ICompanyCostHeaderEntity | null;

/*
 * CurrencyFk
 */
  CurrencyFk?: number | null;

/*
 * HasAccount
 */
  HasAccount?: boolean | null;

/*
 * HasContCostCode
 */
  HasContCostCode?: boolean | null;

/*
 * HasCostCode
 */
  HasCostCode?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsFinal
 */
  IsFinal?: boolean | null;

/*
 * LedgerContextFk
 */
  LedgerContextFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Total
 */
  Total?: number | null;

/*
 * TotalOc
 */
  TotalOc?: number | null;

/*
 * ValueTypeFk
 */
  ValueTypeFk?: number | null;
}
