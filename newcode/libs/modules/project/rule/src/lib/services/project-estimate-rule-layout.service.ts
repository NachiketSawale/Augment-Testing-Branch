import {Injectable} from '@angular/core';
import {EstimateRuleBaseLayoutService} from '@libs/estimate/shared';
import {ILayoutConfiguration} from '@libs/ui/common';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';

@Injectable({ providedIn: 'root' })
export class ProjectEstimateRuleLayoutService extends EstimateRuleBaseLayoutService<IProjectEstimateRuleEntity>{
    /**
     * Generates the layout configuration for estimate line items.
     *
     * @returns A promise that resolves with the layout configuration for estimate line items.
     */
    public override async generateLayout(ruleType: number): Promise<ILayoutConfiguration<IProjectEstimateRuleEntity>> {
        // You can modify the layout here by adding custom logic or calling other methods
        // For this example, we're just returning the common layout as is.
        return this.commonLayout(ruleType) as ILayoutConfiguration<IProjectEstimateRuleEntity>;
    }
}
