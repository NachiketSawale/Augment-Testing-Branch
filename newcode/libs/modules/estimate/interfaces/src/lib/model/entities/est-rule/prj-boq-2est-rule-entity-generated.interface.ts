/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstEvaluationSequenceEntity } from './est-evaluation-sequence-entity.interface';
import { IPrjEstRuleEntity } from './prj-est-rule-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import {IEstRuleSourceEntity} from './est-rule-source-entity.interface';

export interface IPrjBoq2EstRuleEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

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
 * EstRuleSourceEntities
 */
  EstRuleSourceEntities?: IEstRuleSourceEntity[] | null;

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
 * PrjEstRuleEntity
 */
  PrjEstRuleEntity?: IPrjEstRuleEntity | null;

/*
 * PrjEstRuleFk
 */
  PrjEstRuleFk?: number | null;
}
