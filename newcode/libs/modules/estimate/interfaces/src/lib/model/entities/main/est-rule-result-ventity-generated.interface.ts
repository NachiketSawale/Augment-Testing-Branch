/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IEstRuleResultVEntityGenerated {

/*
 * CallStack
 */
  CallStack?: string | null;

/*
 * CurrentColumn
 */
  CurrentColumn?: number | null;

/*
 * CurrentLine
 */
  CurrentLine?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * ElementCode
 */
  ElementCode?: string | null;

/*
 * ElementType
 */
  ElementType?: string | null;

/*
 * ErrorType
 */
  ErrorType?: number | null;

/*
 * EstRuleResultHeaderFk
 */
  EstRuleResultHeaderFk?: number | null;

/*
 * EstRuleResultItemFk
 */
  EstRuleResultItemFk?: number | null;

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
 * LineItemCode
 */
  LineItemCode?: string | null;

/*
 * RuleCode
 */
  RuleCode?: string | null;
}
