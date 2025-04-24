/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstRuleResultItemEntityGenerated extends IEntityBase {

/*
 * ElementCode
 */
  ElementCode?: string | null;

/*
 * ElementType
 */
  ElementType?: string | null;

/*
 * EstRuleResultHeaderFk
 */
  EstRuleResultHeaderFk?: number | null;

/*
 * ExecutionIndex
 */
  ExecutionIndex?: number | null;

/*
 * ExecutionState
 */
  ExecutionState?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * RuleCode
 */
  RuleCode?: string | null;
}
