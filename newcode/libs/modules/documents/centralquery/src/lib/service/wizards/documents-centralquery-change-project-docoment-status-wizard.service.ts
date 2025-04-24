/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {DocumentsCentralQueryHeaderService} from '../../document-header/documents-centralquery-header.service';

@Injectable({
    providedIn: 'root'
})
export class DocumentsCentralQueryChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
    protected readonly dataService = inject(DocumentsCentralQueryHeaderService);
}