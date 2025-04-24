import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable,InjectionToken} from '@angular/core';

export const PROJECT_RULE_PARAMETER_VALUE_BEHAVIOR_TOKEN = new InjectionToken<ProjectRuleParameterValueBehavior>('ProjectRuleParameterValueBehavior');

@Injectable({
    providedIn: 'root'
})
export class ProjectRuleParameterValueBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstimateRuleParameterValueBaseEntity>, IEstimateRuleParameterValueBaseEntity> {

}