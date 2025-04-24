/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { ICompanyNumberEntity } from './company-number-entity.interface';
import { IRubricCategory2CompanyEntity } from './rubric-category-2company-entity.interface';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IRubricIndexEntity } from './rubric-index-entity.interface';

export interface IRubricEntityGenerated  {
  CompanyNumberEntities?: Array<ICompanyNumberEntity>;
  DescriptionInfo?: IDescriptionInfo;
  Id?: number;
  RubricCategory2CompanyEntities?: Array<IRubricCategory2CompanyEntity>;
  RubricCategoryEntities?: Array<IRubricCategoryEntity>;
  RubricIndexEntities?: Array<IRubricIndexEntity>;
}
