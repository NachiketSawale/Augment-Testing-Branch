import {Injectable} from '@angular/core';

import {ILayoutConfiguration} from '@libs/ui/common';
import {EstimateRuleBaseLayoutService} from '@libs/estimate/shared';
import {IEstRuleEntity} from '@libs/estimate/interfaces';
@Injectable({ providedIn: 'root' })
export class EstimateRuleLayoutService extends EstimateRuleBaseLayoutService<IEstRuleEntity>{
    /**
     * Generates the layout configuration for estimate line items.
     *
     * @returns A promise that resolves with the layout configuration for estimate line items.
     */
    public override async generateLayout(ruleType: number): Promise<ILayoutConfiguration<IEstRuleEntity>> {
        // You can modify the layout here by adding custom logic or calling other methods
        // For this example, we're just returning the common layout as is.
        return this.commonLayout(ruleType) as ILayoutConfiguration<IEstRuleEntity>;
    }
}