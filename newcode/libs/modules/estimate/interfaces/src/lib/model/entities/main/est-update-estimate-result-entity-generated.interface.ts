/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRuleExecutionResultEntity } from './est-rule-execution-result-entity.interface';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IEstUpdateEstimateResultEntityGenerated {

/*
 * LineItemUDPs
 */
 // LineItemUDPs?: IUserDefinedcolValEntity[] | null;

/*
 * LineItems
 */
  LineItems?: IEstLineItemEntity[] | null;

/*
 * RuleExecutionResults
 */
  RuleExecutionResults?: IEstRuleExecutionResultEntity[] | null;
}
