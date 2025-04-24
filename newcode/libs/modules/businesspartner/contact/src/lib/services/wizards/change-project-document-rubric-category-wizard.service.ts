/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { BasicsSharedDocumentWizard } from '@libs/documents/shared';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { ContactDocumentProjectDataService } from '../contact-document-project-data.service';

/**
 * Change Project Document RubricCategory Wizard
 */
@Injectable({
	providedIn: 'root'
})
export class BPContactChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(ContactDocumentProjectDataService);
		new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}