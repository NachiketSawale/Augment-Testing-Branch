/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {ProcurementStructureDocumentProjectDataService} from '../procurement-structure-document-project-data.service';

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementStructureChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected override dataService = inject(ProcurementStructureDocumentProjectDataService);
}