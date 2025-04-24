import {inject, Injectable} from '@angular/core';
import {DocumentsSharedChangeProjectDocumentStatusWizardService} from '@libs/documents/shared';
import {PpsItemDocumentProjectDataService} from '../pps-item-document-project-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsItemChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
	protected override readonly dataService = inject(PpsItemDocumentProjectDataService);
}