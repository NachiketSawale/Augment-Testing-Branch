/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import {IEstCostGrpRuleEntity} from './est-cost-grp-rule-entity.interface';
import {IEstEvaluationSequenceEntity} from './est-evaluation-sequence-entity.interface';
import {IPrjBoq2EstRuleEntity} from './prj-boq-2est-rule-entity.interface';
import {IPrjEstRuleEntity} from './prj-est-rule-entity.interface';
import {IPrjEstRuleParamEntity} from './prj-est-rule-param-entity.interface';
import {IPrjEstRuleScriptEntity} from './prj-est-rule-script-entity.interface';

export interface IPrjEstRuleEntityGenerated extends IEntityBase {

/*
 * BasRubricCategoryFk
 */
  BasRubricCategoryFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstCostgrpRuleEntities
 */
  EstCostgrpRuleEntities?: IEstCostGrpRuleEntity[] | null;

/*
 * EstEvaluationSequenceEntity
 */
  EstEvaluationSequenceEntity?: IEstEvaluationSequenceEntity | null;

/*
 * EstEvaluationSequenceFk
 */
  EstEvaluationSequenceFk?: number | null;

/*
 * EstRuleExecutionTypeFk
 */
  EstRuleExecutionTypeFk?: number | null;

/*
 * FormFk
 */
  FormFk?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Icon
 */
  Icon?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsForBoq
 */
  IsForBoq?: boolean | null;

/*
 * IsForEstimate
 */
  IsForEstimate?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsPrjRule
 */
  IsPrjRule?: boolean | null;

/*
 * MainId
 */
  MainId?: number | null;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk?: number | null;

/*
 * Operand
 */
  Operand?: number | null;

/*
 * PrjBoq2estRuleEntities
 */
  PrjBoq2estRuleEntities?: IPrjBoq2EstRuleEntity[] | null;

/*
 * PrjEstRuleChildren
 */
  PrjEstRuleChildren?: IPrjEstRuleEntity[] | null;

/*
 * PrjEstRuleFk
 */
  PrjEstRuleFk?: number | null;

/*
 * PrjEstRuleParamEntities
 */
  PrjEstRuleParamEntities?: IPrjEstRuleParamEntity[] | null;

/*
 * PrjEstRuleParent
 */
  PrjEstRuleParent?: IPrjEstRuleEntity | null;

/*
 * PrjEstRuleScriptEntities
 */
  PrjEstRuleScriptEntities?: IPrjEstRuleScriptEntity[] | null;

/*
 * PrjEstRules
 */
  PrjEstRules?: IPrjEstRuleEntity[] | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
