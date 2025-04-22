/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {ProcurementContractDocumentProjectDataService} from '../services/procurement-contract-document-project-data.service';
import {IInitializationContext} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class ProcurementContractChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected override dataService = inject(ProcurementContractDocumentProjectDataService);
    public static execute(context: IInitializationContext): void {
        context.injector.get(ProcurementContractChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
    }
}