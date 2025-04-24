import {EstimateRuleBaseLayoutService} from '@libs/estimate/shared';
import {IEstimateAssembliesRuleEntity} from '../../model/entities/estimate-assemblies-rule-entity.interface';
import {ILayoutConfiguration} from '@libs/ui/common';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EstimateAssembliesRuleLayoutService extends EstimateRuleBaseLayoutService<IEstimateAssembliesRuleEntity>{
    /**
     * Generates the layout configuration for estimate line items.
     *
     * @returns A promise that resolves with the layout configuration for estimate line items.
     */
    public override async generateLayout(ruleType: number): Promise<ILayoutConfiguration<IEstimateAssembliesRuleEntity>> {
        // You can modify the layout here by adding custom logic or calling other methods
        // For this example, we're just returning the common layout as is.
        return this.commonLayout(ruleType) as ILayoutConfiguration<IEstimateAssembliesRuleEntity>;
    }
}