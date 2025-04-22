/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPaymentEntityGenerated extends IEntityBase {

  /**
   * Amount
   */
  Amount?: number | null;

  /**
   * AmountNet
   */
  AmountNet?: number | null;

  /**
   * AmountNetOc
   */
  AmountNetOc: number;

  /**
   * AmountOc
   */
  AmountOc: number;

  /**
   * AmountVat
   */
  AmountVat?: number | null;

  /**
   * AmountVatOc
   */
  AmountVatOc: number;

  /**
   * BankAccount
   */
  BankAccount?: string | null;

  /**
   * BankEntryNo
   */
  BankEntryNo?: number | null;

  /**
   * BankVoucherNo
   */
  BankVoucherNo?: string | null;

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * CodeRetention
   */
  CodeRetention?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * DiscountAmount
   */
  DiscountAmount?: number | null;

  /**
   * DiscountAmountNet
   */
  DiscountAmountNet?: number | null;

  /**
   * DiscountAmountNetOc
   */
  DiscountAmountNetOc: number;

  /**
   * DiscountAmountOc
   */
  DiscountAmountOc: number;

  /**
   * DiscountAmountVat
   */
  DiscountAmountVat?: number | null;

  /**
   * DiscountAmountVatOc
   */
  DiscountAmountVatOc: number;

  /**
   * ExchangeRate
   */
  ExchangeRate?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsOverPayment
   */
  IsOverPayment: boolean;

  /**
   * IsRetention
   */
  IsRetention: boolean;

  /**
   * PaymentDate
   */
  PaymentDate: Date | string;

  /**
   * PostingDate
   */
  PostingDate: Date | string;

  /**
   * PostingNarritive
   */
  PostingNarritive?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;
}
