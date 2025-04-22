/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IInvInvoiceImportEntity } from '../model/entities';

export const PROCUREMENT_INVOICE_IMPORT_BEHAVIOR_TOKEN = new InjectionToken<ProcurementInvoiceImportBehavior>('procurementInvoiceImportBehavior');

@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceImportBehavior implements IEntityContainerBehavior<IGridContainerLink<IInvInvoiceImportEntity>, IInvInvoiceImportEntity> {
	public onCreate(containerLink: IGridContainerLink<IInvInvoiceImportEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IInvInvoiceImportEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
    }
}