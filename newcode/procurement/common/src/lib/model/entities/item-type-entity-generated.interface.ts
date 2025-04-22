/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IItemTypeEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CodeTr
   */
  CodeTr?: number | null;

  /**
   * Color
   */
  Color?: string | null;

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
