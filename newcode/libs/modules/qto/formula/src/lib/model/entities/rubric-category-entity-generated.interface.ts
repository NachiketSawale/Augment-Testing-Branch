/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoCommentEntity } from './qto-comment-entity.interface';
import { IQtoFormulaEntity } from './qto-formula-entity.interface';
import { IRubricCategory2companyEntity } from './rubric-category-2company-entity.interface';
import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface IRubricCategoryEntityGenerated extends IEntityBase {

/*
 * BasRubricFk
 */
  BasRubricFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DescriptionShort
 */
  DescriptionShort?: string | null;

/*
 * DescriptionShortTr
 */
  DescriptionShortTr?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * QtoCommentEntities
 */
  QtoCommentEntities?: IQtoCommentEntity[] | null;

/*
 * QtoFormulaEntities
 */
  QtoFormulaEntities?: IQtoFormulaEntity[] | null;

/*
 * RubricCategory2companyEntities
 */
  RubricCategory2companyEntities?: IRubricCategory2companyEntity[] | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
