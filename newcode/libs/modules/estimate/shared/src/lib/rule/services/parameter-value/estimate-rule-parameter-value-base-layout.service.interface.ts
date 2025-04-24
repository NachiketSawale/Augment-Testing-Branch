import {ILayoutConfiguration} from '@libs/ui/common';
import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';

export interface IEstimateRuleParameterValueBaseLayoutServiceInterface<T extends IEstimateRuleParameterValueBaseEntity>{
    /**
     * generate layout
     */
    generateLayout(): Promise<ILayoutConfiguration<T>>;
}