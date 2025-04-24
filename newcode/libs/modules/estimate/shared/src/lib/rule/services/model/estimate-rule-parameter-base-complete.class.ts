import {CompleteIdentification} from '@libs/platform/common';
import {IEstimateRuleParameterBaseEntity} from './estimate-rule-parameter-base-entity.interface';


export class EstimateRuleParameterBaseComplete extends CompleteIdentification<IEstimateRuleParameterBaseEntity>{
    public PKey1?: number;

    public MainItemId?: number;
}
