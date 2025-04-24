import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable, InjectionToken} from '@angular/core';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';

export const ESTIMATE_RULE_PARAMETER_BEHAVIOR_TOKEN = new InjectionToken<EstimateRuleParameterBehavior>('EstimateRuleParameterBehavior');

@Injectable({
    providedIn: 'root'
})
export class EstimateRuleParameterBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstimateRuleParameterBaseEntity>, IEstimateRuleParameterBaseEntity> {

}