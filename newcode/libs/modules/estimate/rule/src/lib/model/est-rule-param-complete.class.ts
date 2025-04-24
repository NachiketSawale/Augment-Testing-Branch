/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {IEstimateRuleParameterBaseEntity, IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {EstimateRuleParameterBaseComplete} from '@libs/estimate/shared';
import {EstRuleParamValueComplete} from './est-rule-param-value-complete.class';

export class EstRuleParamComplete extends EstimateRuleParameterBaseComplete{

  public EstimateRuleParameterEntity?: IEstimateRuleParameterBaseEntity | null;

 /*
  * EstRuleParamValueToDelete
  */
  public EstRuleParamValueToDelete: IEstimateRuleParameterValueBaseEntity[] | null = [];

 /*
  * EstRuleParamValueToSave
  */
  public EstRuleParamValueToSave: EstRuleParamValueComplete[] | null = [];

}
