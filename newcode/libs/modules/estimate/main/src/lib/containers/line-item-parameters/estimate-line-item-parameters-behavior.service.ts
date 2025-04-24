import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {EstimateLineItemParametersDataService} from './estimate-line-item-parameters-data.service';
import {Injectable} from '@angular/core';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';

@Injectable({ providedIn: 'root' })
export class EstimateLineItemParametersBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstimateRuleParameterBaseEntity>,IEstimateRuleParameterBaseEntity>{

    public constructor(private dataService: EstimateLineItemParametersDataService) {}

    public onCreate(containerLink: IGridContainerLink<IEstimateRuleParameterBaseEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IEstimateRuleParameterBaseEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }

}