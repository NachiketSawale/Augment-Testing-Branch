/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstEvaluationSequenceEntity } from './est-evaluation-sequence-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import {IEstRuleEntity} from './est-rule-entity.interface';

export interface IEstAssembly2MdcRuleEntityGenerated extends IEntityBase {

/*
 * Comment
 */
  Comment?: string | null;

/*
 * EstAssemblyCatFk
 */
  EstAssemblyCatFk?: number | null;

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
 * EstRuleEntity
 */
  EstRuleEntity?: IEstRuleEntity | null;

/*
 * EstRuleFk
 */
  EstRuleFk?: number | null;

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
}
