import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {EstimateRuleParameterValueBaseComplete} from '@libs/estimate/shared';

export class EstRuleParamValueComplete extends EstimateRuleParameterValueBaseComplete{

    public EstimateRuleParameterEntity?: IEstimateRuleParameterValueBaseEntity | null;
}