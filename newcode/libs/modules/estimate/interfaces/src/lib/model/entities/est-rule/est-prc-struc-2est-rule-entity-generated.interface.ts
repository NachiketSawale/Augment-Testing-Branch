/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstEvaluationSequenceEntity } from './est-evaluation-sequence-entity.interface';
import { IPrjEstRuleEntity } from './prj-est-rule-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstPrcStruc2EstRuleEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * EstEvaluationSequenceEntity
 */
  EstEvaluationSequenceEntity?: IEstEvaluationSequenceEntity | null;

/*
 * EstEvaluationSequenceFk
 */
  EstEvaluationSequenceFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsExecution
 */
  IsExecution?: boolean | null;

/*
 * Operand
 */
  Operand?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PrjEstRuleEntity
 */
  PrjEstRuleEntity?: IPrjEstRuleEntity | null;

/*
 * PrjEstRuleFk
 */
  PrjEstRuleFk?: number | null;
}
