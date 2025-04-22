/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {IInitializationContext} from '@libs/platform/common';
import { ProcurementRfqDocumentProjectDataService } from '../services/procurement-rfq-document-project-data.service';

@Injectable({
    providedIn: 'root'
})
export class ProcurementRfqChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected override dataService = inject(ProcurementRfqDocumentProjectDataService);
    public static execute(context: IInitializationContext): void {
        context.injector.get(ProcurementRfqChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
    }
}