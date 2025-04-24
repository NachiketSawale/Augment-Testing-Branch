/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstRootAssignmentDetailEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * EstEvaluationSequenceFk
 */
  EstEvaluationSequenceFk?: number | null;

/*
 * EstRootAssignmentLevelFk
 */
  EstRootAssignmentLevelFk?: number | null;

/*
 * EstRootAssignmentTypeFk
 */
  EstRootAssignmentTypeFk?: number | null;

/*
 * EstRuleFk
 */
  EstRuleFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsExecution
 */
  IsExecution?: boolean | null;

/*
 * Operand
 */
  Operand?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
