/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IRubricCategory2companyEntityGenerated extends IEntityBase {

/*
 * BasCompanyFk
 */
  BasCompanyFk?: number | null;

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk?: number | null;

/*
 * BasRubricFk
 */
  BasRubricFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * RubricCategoryEntity
 */
  RubricCategoryEntity?: IRubricCategoryEntity | null;
}
