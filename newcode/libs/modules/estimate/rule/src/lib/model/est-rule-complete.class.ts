/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EstRuleParamComplete } from './est-rule-param-complete.class';
import { IEstRuleScriptEntity } from './entities/est-rule-script-entity.interface';

import {EstimateRuleBaseComplete, IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';

export class EstRuleComplete extends EstimateRuleBaseComplete{

  /*
   * EstRuleScriptToSave
   */
  public EstRuleScriptToSave: IEstRuleScriptEntity[] | null = [];


  public EstRuleParamToDelete: IEstimateRuleParameterBaseEntity[] | null = [];

  /*
   * EstRuleParamToSave
   */
  public EstRuleParamToSave?: EstRuleParamComplete[] | null;
}
