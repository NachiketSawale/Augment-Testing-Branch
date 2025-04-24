/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase} from '@libs/platform/common';

export interface EstimateRuleScriptBaseEntity extends IEntityBase{
    /*
     * Id
     */
    Id?: number | null;

    /*
     * PrjEstRuleFk
     */
    PrjEstRuleFk?: number | null;

    /*
    * EstRuleFk
    */
    EstRuleFk?: number | null;

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