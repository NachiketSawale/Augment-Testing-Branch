/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { ICompanyNumberEntity } from './company-number-entity.interface';
import { IRubricCategory2CompanyEntity } from './rubric-category-2company-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';

export interface IRubricCategoryEntityGenerated {
  BasRubricFk?: number;
  CompanyNumberEntities?: Array<ICompanyNumberEntity>;
  DescriptionInfo?: IDescriptionInfo;
  DescriptionInfoShort?: IDescriptionInfo;
  Id?: number;
  Isdefault?: boolean;
  Islive?: boolean;
  RubricCategory2CompanyEntities?: Array<IRubricCategory2CompanyEntity>;
  RubricEntity?: IRubricEntity;
  Sorting?: number;
}
