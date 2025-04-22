/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {IInitializationContext} from '@libs/platform/common';
import { ProcurementInvoiceDocumentProjectDataService } from '../services/procurement-invoice-document-project-data.service';
@Injectable({
    providedIn: 'root'
})
export class ProcurementInvoiceChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected override dataService = inject(ProcurementInvoiceDocumentProjectDataService);
    public static execute(context: IInitializationContext): void {
        context.injector.get(ProcurementInvoiceChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
    }
}