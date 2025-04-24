/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstEvaluationSequenceEntity } from './est-evaluation-sequence-entity.interface';
import { IEstRuleSrc2CostGroupRuleEntity } from './est-rule-src-2cost-group-rule-entity.interface';
import { IPrjEstRuleEntity } from './prj-est-rule-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstCostGrpRuleEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * CostGroupCatFk
 */
  CostGroupCatFk?: number | null;

/*
 * CostGroupFk
 */
  CostGroupFk?: number | null;

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
 * EstRuleSrc2CostGroupRuleEntities
 */
  EstRuleSrc2CostGroupRuleEntities?: IEstRuleSrc2CostGroupRuleEntity[] | null;

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
