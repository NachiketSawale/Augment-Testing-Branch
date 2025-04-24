/*
 * Copyright(c) RIB Software GmbH
 */

import { IRubricCategoryTreeItemEntity } from './rubric-category-tree-item-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IRubricCategoryTreeItemEntityGenerated {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * ParentFk
   */
  ParentFk?: number | null;

  /**
   * RubricCategories
   */
  RubricCategories?: IRubricCategoryTreeItemEntity[] | null;

  /**
   * RubricCategoryId
   */
  RubricCategoryId?: number | null;

  /**
   * RubricId
   */
  RubricId: number;
}
