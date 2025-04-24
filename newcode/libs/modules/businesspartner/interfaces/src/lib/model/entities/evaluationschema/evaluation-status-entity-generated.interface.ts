/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEvaluationStatusEntityGenerated extends IEntityBase {

  /**
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /**
   * DenyDelete
   */
  DenyDelete: boolean;

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
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsNotToCount
   */
  IsNotToCount: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Readonly
   */
  Readonly: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
