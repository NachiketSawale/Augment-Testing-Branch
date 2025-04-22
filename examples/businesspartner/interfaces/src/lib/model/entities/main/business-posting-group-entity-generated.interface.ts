/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBusinessPostingGroupEntityGenerated extends IEntityBase {

  /**
   * BpdSubledgerContextFk
   */
  BpdSubledgerContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * GroupFinance
   */
  GroupFinance?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
