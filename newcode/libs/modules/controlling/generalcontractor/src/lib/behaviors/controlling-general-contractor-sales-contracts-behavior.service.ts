import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ISalesContractsEntity} from '../model/entities/gcc-sales-contracts-entity.interface';
import {Injectable, InjectionToken} from '@angular/core';

export const CONTROLLING_GENERAL_CONTRACTOR_SALES_CONTRACTS_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorSalesContractsBehavior>('controllingGeneralContractorSalesContractsBehavior');

@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorSalesContractsBehavior implements IEntityContainerBehavior<IGridContainerLink<ISalesContractsEntity>, ISalesContractsEntity> {

    public onCreate(containerLink: IGridContainerLink<ISalesContractsEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<ISalesContractsEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}