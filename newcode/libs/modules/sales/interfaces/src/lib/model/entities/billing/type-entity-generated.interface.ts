/*
 * Copyright(c) RIB Software GmbH
 */

import { IVoucherTypeEntity } from './voucher-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ITypeEntityGenerated extends IEntityBase {

  /**
   * Abbreviation
   */
  Abbreviation?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsCreditmemo
   */
  IsCreditmemo: boolean;

  /**
   * IsCumulativeTransaction
   */
  IsCumulativeTransaction: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsFinalInvoiceCorrection
   */
  IsFinalInvoiceCorrection: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsPartialFinalInvoice
   */
  IsPartialFinalInvoice: boolean;

  /**
   * IsPaymentSchedule
   */
  IsPaymentSchedule: boolean;

  /**
   * IsProforma
   */
  IsProforma: boolean;

  /**
   * IsProgress
   */
  IsProgress: boolean;

  /**
   * IsPsBalancing
   */
  IsPsBalancing: boolean;

  /**
   * IsSingle
   */
  IsSingle: boolean;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * TypeCode
   */
  TypeCode?: string | null;

  /**
   * VoucherTypeEntities
   */
  VoucherTypeEntities?: IVoucherTypeEntity[] | null;
}
