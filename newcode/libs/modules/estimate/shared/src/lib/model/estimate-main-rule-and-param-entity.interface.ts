/*	
 * Copyright(c) RIB Software GmbH
 */

import { IEstRuleEntity, IPrjEstRuleParamEntity } from '@libs/estimate/interfaces';

/**
 * This interface will be used by all leading structure entities
 */

export interface IEstRuleAndParam {
    Rule?:IEstRuleEntity[],
    Param?:IPrjEstRuleParamEntity // TODO replace this entity by EstParamEntity
}