/*
 * Copyright(c) RIB Software GmbH
 */

export interface ITransactionParamEntityGenerated {

  /**
   * Abbreviation
   */
  Abbreviation?: string | null;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * CompanyPeriodId
   */
  CompanyPeriodId: number;

  /**
   * CompanyYearId
   */
  CompanyYearId: number;

  /**
   * PostingNarrative
   */
  PostingNarrative?: string | null;

  /**
   * TransactionTypeId
   */
  TransactionTypeId: number;

  /**
   * UseCompanyNumber
   */
  UseCompanyNumber: boolean;

  /**
   * VoucherNo
   */
  VoucherNo?: string | null;
}
