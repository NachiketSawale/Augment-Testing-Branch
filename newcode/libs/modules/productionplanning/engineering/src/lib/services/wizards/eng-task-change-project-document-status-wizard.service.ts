/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentsSharedChangeProjectDocumentStatusWizardService } from '@libs/documents/shared';

import { IInitializationContext } from '@libs/platform/common';
import { EngineeringDocumentProjectDataService } from '../engineering-document-project-data.service';

@Injectable({
	providedIn: 'root',
})
export class EngTaskChangeProjectDocumentStatusWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
	protected override dataService = inject(EngineeringDocumentProjectDataService);

	public static execute(context: IInitializationContext): void {
		context.injector.get(EngTaskChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
	}
}
