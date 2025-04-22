/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import { DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {IInitializationContext} from '@libs/platform/common';
import { ProcurementQuoteDocumentProjectDataService } from '../procurement-quote-document-project-data.service';


@Injectable({
    providedIn: 'root'
})
export class ProcurementQuoteChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
   //Todo: We required "ProcurementQuoteDocumentProjectDataService" service for this wizard so that I created but actual functionality is pending.
    protected override dataService = inject(ProcurementQuoteDocumentProjectDataService);
   
    public static execute(context: IInitializationContext): void {
        context.injector.get(ProcurementQuoteChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
    }
}