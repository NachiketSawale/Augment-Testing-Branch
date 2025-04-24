/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {IPrjEstRuleEntity} from '@libs/estimate/interfaces';

export interface IReadDataGenerated {

/*
 * estRuleId
 */
  estRuleId?: number | null;

/*
 * lineItemContextId
 */
  lineItemContextId?: number | null;

/*
 * prjEstRule
 */
  prjEstRule?: IPrjEstRuleEntity | null;

/*
 * ruleId
 */
  ruleId?: number | null;

/*
 * ruleIds
 */
  ruleIds?: number[] | null;
}
