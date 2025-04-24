/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrjEstRuleScriptEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id?: number | null;

/*
 * PrjEstRuleFk
 */
  PrjEstRuleFk?: number | null;

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
