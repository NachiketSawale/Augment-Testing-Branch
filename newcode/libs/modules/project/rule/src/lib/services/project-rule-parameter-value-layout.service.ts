import {EstimateRuleParameterValueBaseLayoutService} from '@libs/estimate/shared';
import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {ILayoutConfiguration} from '@libs/ui/common';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectRuleParameterValueLayoutService extends EstimateRuleParameterValueBaseLayoutService<IEstimateRuleParameterValueBaseEntity>{

    public override async generateLayout(): Promise<ILayoutConfiguration<IEstimateRuleParameterValueBaseEntity>> {
        // You can modify the layout here by adding custom logic or calling other methods
        // For this example, we're just returning the common layout as is.
        return this.commonLayout() as ILayoutConfiguration<IEstimateRuleParameterValueBaseEntity>;
    }
}