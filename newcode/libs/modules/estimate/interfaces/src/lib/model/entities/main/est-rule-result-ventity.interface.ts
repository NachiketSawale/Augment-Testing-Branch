/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRuleResultVEntityGenerated } from './est-rule-result-ventity-generated.interface';
import {ScriptDefProvider} from '@libs/ui/common';

export interface IEstRuleResultVEntity extends IEstRuleResultVEntityGenerated {
    ScriptProvider: ScriptDefProvider;
    mainItemIdField?: string;
    scriptField: string;
}
