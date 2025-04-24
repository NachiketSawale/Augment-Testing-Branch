/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentsSharedChangeProjectDocumentStatusWizardService } from '@libs/documents/shared';
import { BusinesspartnerCertificateDocumentProjectDataService } from '../certificate-document-project-data.service';

@Injectable({
	providedIn: 'root',
})
export class BPCertificateChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
	protected override dataService = inject(BusinesspartnerCertificateDocumentProjectDataService);
}
