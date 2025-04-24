/*
 * Copyright(c) RIB Software GmbH
 */

import { IRubricCategory2CompanyEntity } from './rubric-category-2-company-entity.interface';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IRubricEntityGenerated extends IEntityBase {

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
   * RubricCategory2CompEntities
   */
  RubricCategory2CompEntities?: IRubricCategory2CompanyEntity[] | null;

  /**
   * RubricCategoryEntities
   */
  RubricCategoryEntities?: IRubricCategoryEntity[] | null;
}
