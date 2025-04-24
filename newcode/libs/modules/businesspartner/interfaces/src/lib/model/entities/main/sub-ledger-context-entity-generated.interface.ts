/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ISubLedgerContextEntityGenerated extends IEntityBase {

  /**
   * BasRubricCategoryCFk
   */
  BasRubricCategoryCFk?: number | null;

  /**
   * BasRubricCategorySFk
   */
  BasRubricCategorySFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
