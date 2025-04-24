/*
 * Copyright(c) RIB Software GmbH
 */

import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IRubricCategory2CompanyEntityGenerated extends IEntityBase {

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * RubricCategoryEntity
   */
  RubricCategoryEntity?: IRubricCategoryEntity | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * RubricEntity
   */
  RubricEntity?: IRubricEntity | null;

  /**
   * RubricFk
   */
  RubricFk: number;
}
