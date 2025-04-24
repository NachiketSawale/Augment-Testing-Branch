/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';

export interface IRubricCategory2CompanyEntityGenerated {
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  Id?: number;
  RubricCategoryEntity?: IRubricCategoryEntity;
  RubricCategoryFk?: number;
  RubricEntity?: IRubricEntity;
  RubricFk?: number;
}
