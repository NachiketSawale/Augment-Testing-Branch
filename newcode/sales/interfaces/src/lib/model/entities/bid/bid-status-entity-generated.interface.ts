/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBidStatusEntityGenerated extends IEntityBase {

  /**
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /**
   * BidHeaderEntities
   */
  BidHeaderEntities?: IBidHeaderEntity[] | null;

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
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsQuoted
   */
  IsQuoted: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
