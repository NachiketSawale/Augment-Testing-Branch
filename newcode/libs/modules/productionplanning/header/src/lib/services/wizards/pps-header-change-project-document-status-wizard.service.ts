/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentsSharedChangeProjectDocumentStatusWizardService } from '@libs/documents/shared';

import { IInitializationContext } from '@libs/platform/common';
import { PpsHeaderDocumentProjectDataService } from '../pps-header-document-project-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
	protected override dataService = inject(PpsHeaderDocumentProjectDataService);
	public static execute(context: IInitializationContext): void {
		context.injector.get(PpsHeaderChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
	}
}
