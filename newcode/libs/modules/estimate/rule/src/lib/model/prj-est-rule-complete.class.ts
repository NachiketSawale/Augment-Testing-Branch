/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PrjEstRuleParamComplete } from './prj-est-rule-param-complete.class';

import { CompleteIdentification } from '@libs/platform/common';
import {IPrjEstRuleEntity, IPrjEstRuleParamEntity, IPrjEstRuleScriptEntity} from '@libs/estimate/interfaces';

export class PrjEstRuleComplete implements CompleteIdentification<IPrjEstRuleParamEntity>{

 /*
  * Id
  */
  public Id: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId: number | null = 10;

 /*
  * PrjEstRule
  */
  public PrjEstRule: IPrjEstRuleEntity | null = null;

 /*
  * PrjEstRuleParamToDelete
  */
  public PrjEstRuleParamToDelete: IPrjEstRuleParamEntity[] | null = [];

 /*
  * PrjEstRuleParamToSave
  */
  public PrjEstRuleParamToSave: PrjEstRuleParamComplete[] | null = [];

 /*
  * PrjEstRuleScriptToDelete
  */
  public PrjEstRuleScriptToDelete: IPrjEstRuleScriptEntity[] | null = [];

 /*
  * PrjEstRuleScriptToSave
  */
  public PrjEstRuleScriptToSave: IPrjEstRuleScriptEntity[] | null = [];
}
