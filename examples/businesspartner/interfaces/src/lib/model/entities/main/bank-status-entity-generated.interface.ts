/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBankStatusEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsApproved
   */
  IsApproved: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsDisabled
   */
  IsDisabled: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
