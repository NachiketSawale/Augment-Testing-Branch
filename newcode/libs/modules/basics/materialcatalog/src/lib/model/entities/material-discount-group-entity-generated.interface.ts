/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialDiscountGroupEntity } from './material-discount-group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialDiscountGroupEntityGenerated extends IEntityBase {

  /**
   * ChildItems
   */
  ChildItems?: IMaterialDiscountGroupEntity[] | null;

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Discount
   */
  Discount: number;

  /**
   * DiscountType
   */
  DiscountType: number;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialDiscountGroupFk
   */
  MaterialDiscountGroupFk?: number | null;
}
