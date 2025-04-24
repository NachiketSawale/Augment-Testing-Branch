/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcTotalTypeEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Formula
   */
  Formula?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsAutoCreate
   */
  IsAutoCreate: boolean;

  /**
   * IsBold
   */
  IsBold: boolean;

  /**
   * IsDashBTotal
   */
  IsDashBTotal: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsEditableGross
   */
  IsEditableGross: boolean;

  /**
   * IsEditableNet
   */
  IsEditableNet: boolean;

  /**
   * IsEditableTax
   */
  IsEditableTax: boolean;

  /**
   * IsItalic
   */
  IsItalic: boolean;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcTotalKindFk
   */
  PrcTotalKindFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * SqlStatement
   */
  SqlStatement?: string | null;

  /**
   * TotalType
   */
  TotalType: number;
}
