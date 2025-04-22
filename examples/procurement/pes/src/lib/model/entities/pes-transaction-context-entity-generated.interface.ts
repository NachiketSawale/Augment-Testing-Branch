/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPesTransactionContextEntityGenerated {

  /**
   * Abbreviation
   */
  Abbreviation?: string | null;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * EffectiveDate
   */
  EffectiveDate: string;

  /**
   * PesAccrualModeId
   */
  PesAccrualModeId: number;

  /**
   * PesHeaderId
   */
  PesHeaderId?: number | null;

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
