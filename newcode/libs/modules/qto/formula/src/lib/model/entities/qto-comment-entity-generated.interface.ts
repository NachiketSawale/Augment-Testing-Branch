/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IQtoCommentEntityGenerated extends IEntityBase {

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * PrjProjectFk
 */
  PrjProjectFk?: number | null;

/*
 * RubricCategoryEntity
 */
  RubricCategoryEntity?: IRubricCategoryEntity | null;
}
