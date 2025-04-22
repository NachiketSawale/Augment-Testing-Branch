/*
 * Copyright(c) RIB Software GmbH
 */

export interface IBilAccrualsCreationEntityGenerated {

  /**
   * AccrualMode
   */
  AccrualMode: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EffectiveDate
   */
  EffectiveDate: Date | string;

  /**
   * PostingDate
   */
  PostingDate: Date | string;

  /**
   * VoucherNo
   */
  VoucherNo?: string | null;
}
