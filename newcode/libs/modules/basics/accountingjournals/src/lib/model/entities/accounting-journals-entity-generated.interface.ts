/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IAccountingJournalsEntityGenerated extends IEntityBase {

/*
 * BasCompanyTransheader
 */
  BasCompanyTransheader?: string | null;

/*
 * BasCompanyTransheaderFk
 */
  BasCompanyTransheaderFk?: number | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * CompanyPeriodFk
 */
  CompanyPeriodFk: number;

/*
 * CompanyTransheaderStatusFk
 */
  CompanyTransheaderStatusFk: number;

/*
 * CompanyYearFk
 */
  CompanyYearFk: number;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsSuccess
 */
  IsSuccess?: boolean | null;

/*
 * PostingDate
 */
  PostingDate: string;

/*
 * ReturnValue
 */
  ReturnValue?: string | null;

/*
 * TradingPeriod
 */
  TradingPeriod?: number | null;

/*
 * TradingPeriodEndDate
 */
  TradingPeriodEndDate?: string | null;

/*
 * TradingPeriodStartDate
 */
  TradingPeriodStartDate?: string | null;

/*
 * TradingYear
 */
  TradingYear?: number | null;

/*
 * TransactionTypeAbbreviation
 */
  TransactionTypeAbbreviation?: string | null;

/*
 * TransactionTypeDescription
 */
  TransactionTypeDescription?: string | null;

/*
 * TransactionTypeFk
 */
  TransactionTypeFk: number;
}
