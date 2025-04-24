/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstRuleScriptEntityGenerated extends IEntityBase {

/*
 * EstRuleFk
 */
  EstRuleFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ScriptData
 */
  ScriptData?: string | null;

/*
 * TestInput
 */
  TestInput?: string | null;

/*
 * ValidateScriptData
 */
  ValidateScriptData?: string | null;
}
