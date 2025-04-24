/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';

import {IInitializationContext} from '@libs/platform/common';
import { ProcurementPackageDocumentProjectDataService } from '../services/procurement-package-document-project-data.service';

@Injectable({
    providedIn: 'root'
})
export class ProcurementPackageChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected override dataService = inject(ProcurementPackageDocumentProjectDataService);
    public static execute(context: IInitializationContext): void {
        context.injector.get(ProcurementPackageChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
    }
}