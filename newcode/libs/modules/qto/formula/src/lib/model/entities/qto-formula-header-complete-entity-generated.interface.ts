/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoCommentEntity } from './qto-comment-entity.interface';
import { IQtoFormulaScriptEntity } from './qto-formula-script-entity.interface';
import { IQtoFormulaScriptTransEntity } from './qto-formula-script-trans-entity.interface';
import { IQtoFormulaEntity } from './qto-formula-entity.interface';
import { IQtoFormulaItemCompleteEntity } from './qto-formula-item-complete-entity.interface';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';

export interface IQtoFormulaHeaderCompleteEntityGenerated {

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * QtoCommentToDelete
 */
  QtoCommentToDelete?: IQtoCommentEntity[] | null;

/*
 * QtoCommentToSave
 */
  QtoCommentToSave?: IQtoCommentEntity[] | null;

/*
 * QtoFormulaScriptToSave
 */
  QtoFormulaScriptToSave?: IQtoFormulaScriptEntity[] | null;

/*
 * QtoFormulaScriptTransToDelete
 */
  QtoFormulaScriptTransToDelete?: IQtoFormulaScriptTransEntity[] | null;

/*
 * QtoFormulaScriptTransToSave
 */
  QtoFormulaScriptTransToSave?: IQtoFormulaScriptTransEntity[] | null;

/*
 * QtoFormulaToDelete
 */
  QtoFormulaToDelete?: IQtoFormulaEntity[] | null;

/*
 * QtoFormulaToSave
 */
  QtoFormulaToSave?: IQtoFormulaItemCompleteEntity[] | null;

/*
 * RubricCategory
 */
  RubricCategory?: IRubricCategoryEntity | null;
}
