/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {IInitializationContext} from '@libs/platform/common';
import { BusinessPartnerMainDocumentProjectDataService } from '../businesspartner-main-document-project-data.service';

@Injectable({
    providedIn: 'root'
})
export class BusinessPartnerMainChangeStatusForProjectDocumentService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected override dataService = inject(BusinessPartnerMainDocumentProjectDataService);
    public static execute(context: IInitializationContext): void {
        context.injector.get(BusinessPartnerMainChangeStatusForProjectDocumentService).onStartChangeStatusWizard();
    }
}