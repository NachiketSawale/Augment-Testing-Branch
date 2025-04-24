import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable, InjectionToken} from '@angular/core';
import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';

export const ESTIMATE_RULE_PARAMETER_VALUE_BEHAVIOR_TOKEN = new InjectionToken<EstimateRuleParameterValueBehavior>('EstimateRuleParameterValueBehavior');

@Injectable({
    providedIn: 'root'
})
export class EstimateRuleParameterValueBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstimateRuleParameterValueBaseEntity>, IEstimateRuleParameterValueBaseEntity> {

}