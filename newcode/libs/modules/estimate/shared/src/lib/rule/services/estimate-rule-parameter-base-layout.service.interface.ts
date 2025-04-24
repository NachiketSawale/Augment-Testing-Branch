import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';
import {ILayoutConfiguration} from '@libs/ui/common';


export interface IEstimateRuleParameterBaseLayoutServiceInterface<T extends IEstimateRuleParameterBaseEntity>{
    /**
     * generate layout
     */
    generateLayout(): Promise<ILayoutConfiguration<T>>;
}