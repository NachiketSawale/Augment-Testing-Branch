import {IEstimateRuleParameterBaseLayoutService} from '@libs/estimate/shared';
import {ILayoutConfiguration} from '@libs/ui/common';
import {Injectable} from '@angular/core';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';

@Injectable({ providedIn: 'root' })
export class EstimateRuleParameterLayoutService extends IEstimateRuleParameterBaseLayoutService<IEstimateRuleParameterBaseEntity>{

    public override async generateLayout(): Promise<ILayoutConfiguration<IEstimateRuleParameterBaseEntity>> {
        // You can modify the layout here by adding custom logic or calling other methods
        // For this example, we're just returning the common layout as is.
        return this.commonLayout() as ILayoutConfiguration<IEstimateRuleParameterBaseEntity>;
    }
}