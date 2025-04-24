/*
 * Copyright(c) RIB Software GmbH
 */

export interface ITransactionParamEntityGenerated {

  /**
   * Abbreviation
   */
  Abbreviation?: string | null;

  /**
   * AccrualModeId
   */
  AccrualModeId: number;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * CompanyPeriodId_End
   */
  CompanyPeriodId_End: number;

  /**
   * CompanyPeriodId_Start
   */
  CompanyPeriodId_Start: number;

  /**
   * CompanyYearId_End
   */
  CompanyYearId_End: number;

  /**
   * CompanyYearId_Start
   */
  CompanyYearId_Start: number;

  /**
   * EffectiveDate_End
   */
  EffectiveDate_End: string;

  /**
   * EffectiveDate_Start
   */
  EffectiveDate_Start: string;

  /**
   * ModuleName
   */
  ModuleName?: string | null;

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
