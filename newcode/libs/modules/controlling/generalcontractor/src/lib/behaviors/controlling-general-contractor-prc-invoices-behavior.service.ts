import {Injectable, InjectionToken} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IGccPrcInvoicesEntity} from '../model/entities/gcc-prc-invoices-entity.interface';

export const CONTROLLING_GENERAL_CONTRACTOR_PRC_INVOICES_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorPrcInvoicesBehavior>('controllingGeneralContractorPrcInvoicesBehavior');

@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorPrcInvoicesBehavior implements IEntityContainerBehavior<IGridContainerLink<IGccPrcInvoicesEntity>, IGccPrcInvoicesEntity> {

    public onCreate(containerLink: IGridContainerLink<IGccPrcInvoicesEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IGccPrcInvoicesEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}