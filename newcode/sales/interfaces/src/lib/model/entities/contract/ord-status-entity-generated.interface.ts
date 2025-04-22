/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IOrdStatusEntityGenerated extends IEntityBase {

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
   * IsCanceled
   */
  IsCanceled: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsFinallyBilled
   */
  IsFinallyBilled: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsOrdered
   */
  IsOrdered: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * OrdHeaderEntities
   */
  OrdHeaderEntities?: IOrdHeaderEntity[] | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
