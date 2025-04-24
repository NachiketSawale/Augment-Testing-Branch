/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPriceConditionEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * FormulaText
   */
  FormulaText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * RemarkInfo
   */
  RemarkInfo?: IDescriptionInfo | null;

  /**
   * Sorting
   */
  Sorting: number;
}
