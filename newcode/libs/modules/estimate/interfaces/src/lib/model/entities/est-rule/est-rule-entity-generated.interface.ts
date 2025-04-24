/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstimateRuleParameterBaseEntity } from '../parameter/estimate-rule-parameter-base-entity.interface';
import { IEstAssembly2MdcRuleEntity } from './est-assembly-2mdc-rule-entity.interface';
import { IEstLineItem2MdcRuleEntity } from './est-line-item-2mdc-rule-entity.interface';
import { IEstRuleEntity } from './est-rule-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstRuleEntityGenerated extends IEntityBase{

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
 * EstAssembly2MdcRuleEntities
 */
  EstAssembly2MdcRuleEntities?: IEstAssembly2MdcRuleEntity[] | null;

/*
 * EstEvaluationSequenceFk
 */
  EstEvaluationSequenceFk?: number | null;

/*
 * EstLineitem2MdcRuleEntities
 */
  EstLineitem2MdcRuleEntities?: IEstLineItem2MdcRuleEntity[] | null;


  IEstRuleParameterEntities ?:IEstimateRuleParameterBaseEntity[]|  [];

/*
 * EstRuleChildren
 */
  EstRuleChildren?: IEstRuleEntity[] | null;

/*
 * EstRuleExecutionTypeFk
 */
  EstRuleExecutionTypeFk?: number | null;

/*
 * EstRuleFk
 */
  EstRuleFk?: number | null;

/*
 * EstRuleParent
 */
  // EstRuleParent?: IEstRuleEntity | null;

/*
 * EstRules
 */
  EstRules?: IEstRuleEntity[] | null;

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
  Id?: number;

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
 * Remark
 */
  Remark?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
