/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPeriodEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * Description
 */
  Description?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Due1Date
 */
  Due1Date?: string | null;

/*
 * Due2Date
 */
  Due2Date?: string | null;

/*
 * EndDate
 */
  EndDate: Date|string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * PayrollDate
 */
  PayrollDate?: string | null;

/*
 * PayrollPeriod
 */
  PayrollPeriod: number;

/*
 * PayrollYear
 */
  PayrollYear: number;

/*
 * PeriodStatusFk
 */
  PeriodStatusFk: number;

/*
 * PostingDate
 */
  PostingDate?: Date|string|null;

/*
 * RubricCategoryFk
 */
  RubricCategoryFk: number;

/*
 * StartDate
 */
  StartDate: Date|string|null;

/*
 * TimekeepingGroupFk
 */
  TimekeepingGroupFk: number;

/*
 * TimesheetContextFk
 */
  TimesheetContextFk: number;

/*
 * UserDefinedDate01
 */
  UserDefinedDate01?: string | null;

/*
 * UserDefinedDate02
 */
  UserDefinedDate02?: string | null;

/*
 * UserDefinedDate03
 */
  UserDefinedDate03?: string | null;

/*
 * UserDefinedDate04
 */
  UserDefinedDate04?: string | null;

/*
 * UserDefinedDate05
 */
  UserDefinedDate05?: string | null;

/*
 * UserDefinedNumber01
 */
  UserDefinedNumber01?: number | null;

/*
 * UserDefinedNumber02
 */
  UserDefinedNumber02?: number | null;

/*
 * UserDefinedNumber03
 */
  UserDefinedNumber03?: number | null;

/*
 * UserDefinedNumber04
 */
  UserDefinedNumber04?: number | null;

/*
 * UserDefinedNumber05
 */
  UserDefinedNumber05?: number | null;

/*
 * UserDefinedText01
 */
  UserDefinedText01?: string | null;

/*
 * UserDefinedText02
 */
  UserDefinedText02?: string | null;

/*
 * UserDefinedText03
 */
  UserDefinedText03?: string | null;

/*
 * UserDefinedText04
 */
  UserDefinedText04?: string | null;

/*
 * UserDefinedText05
 */
  UserDefinedText05?: string | null;

/*
 * VoucherDate
 */
  VoucherDate?: string | null;

/*
 * VoucherNumber
 */
  VoucherNumber?: string | null;
}
