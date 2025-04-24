/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {IEstRuleEntity} from '@libs/estimate/interfaces';

export const ESTIMATE_RULE_BEHAVIOR_TOKEN = new InjectionToken<EstimateRuleBehavior>('estimateRuleBehavior');

@Injectable({
	providedIn: 'root'
})
export class EstimateRuleBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstRuleEntity>, IEstRuleEntity> {

}