/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {IInitializationContext} from '@libs/platform/common';
import { ProcurementRequisitionDocumentProjectDataService } from '../procurement-requisition-document-project-data.service';

@Injectable({
    providedIn: 'root'
})
export class ProcurementRequisitionChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected override dataService = inject(ProcurementRequisitionDocumentProjectDataService);
    public static execute(context: IInitializationContext): void {
        context.injector.get(ProcurementRequisitionChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
    }
}