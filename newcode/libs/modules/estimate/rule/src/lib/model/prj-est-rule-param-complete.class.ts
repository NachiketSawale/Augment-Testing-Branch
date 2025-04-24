/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import {IEstimateRuleParameterValueBaseEntity, IPrjEstRuleParamEntity} from '@libs/estimate/interfaces';

export class PrjEstRuleParamComplete implements CompleteIdentification<IPrjEstRuleParamEntity>{

 /*
  * MainItemId
  */
  public MainItemId: number | null = 10;

 /*
  * PrjEstRuleParam
  */
  public PrjEstRuleParam: IPrjEstRuleParamEntity | null = {};

 /*
  * PrjRuleParamValueToDelete
  */
  public PrjRuleParamValueToDelete: IEstimateRuleParameterValueBaseEntity[] | null = [];

 /*
  * PrjRuleParamValueToSave
  */
  public PrjRuleParamValueToSave: IEstimateRuleParameterValueBaseEntity[] | null = [];
}
