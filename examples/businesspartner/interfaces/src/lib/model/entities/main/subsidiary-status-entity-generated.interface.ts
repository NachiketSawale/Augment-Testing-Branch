/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ISubsidiaryStatusEntityGenerated extends IEntityBase {

  /**
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /**
   * Code
   */
  Code: string;

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
   * IsActive
   */
  IsActive: boolean;

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
