/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IScriptErrorEntityEntity } from './script-error-entity-entity.interface';

export interface IEstRuleExecutionResultEntityGenerated {

/*
 * AssignedStructureType
 */
  AssignedStructureType?: string | null;

/*
 * ElementCode
 */
  ElementCode?: string | null;

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

/*
 * RuleId
 */
  RuleId?: number | null;

/*
 * ScriptErrorList
 */
  ScriptErrorList?: IScriptErrorEntityEntity[] | null;
}
