/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IConTotalEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Gross
   */
  Gross: number;

  /**
   * GrossOc
   */
  GrossOc: number;

  /**
   * HeaderFk
   */
  HeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * TotalKindFk
   */
  TotalKindFk?: number | null;

  /**
   * TotalTypeFk
   */
  TotalTypeFk: number;

  /**
   * ValueNet
   */
  ValueNet: number;

  /**
   * ValueNetOc
   */
  ValueNetOc: number;

  /**
   * ValueTax
   */
  ValueTax: number;

  /**
   * ValueTaxOc
   */
  ValueTaxOc: number;
}
