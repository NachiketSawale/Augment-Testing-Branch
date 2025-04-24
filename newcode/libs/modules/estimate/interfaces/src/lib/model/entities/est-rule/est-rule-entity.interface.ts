/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IEstRuleEntityGenerated} from './est-rule-entity-generated.interface';

export interface IEstRuleEntity extends IEstRuleEntityGenerated {
    OriginalMainId?: number | null;
    CustomEstRuleFk?: number | null;
    ParentCode?: string | null;
    CustomEstRules: IEstRuleEntity[] | null;
}
