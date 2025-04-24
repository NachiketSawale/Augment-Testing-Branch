import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {EstimateRuleParameterValueBaseComplete} from '@libs/estimate/shared';

export class ProjectRuleParamValueComplete extends EstimateRuleParameterValueBaseComplete{

    public ProjectRuleParameterEntity?: IEstimateRuleParameterValueBaseEntity | null;

}