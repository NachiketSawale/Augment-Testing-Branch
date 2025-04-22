/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {BasicsSharedDocumentWizard} from '@libs/documents/shared';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { ProcurementQuoteDocumentProjectDataService } from '../procurement-quote-document-project-data.service';

/**
 * Change Project Document RubricCategory Wizard for Quote
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementQuoteChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(ProcurementQuoteDocumentProjectDataService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}
