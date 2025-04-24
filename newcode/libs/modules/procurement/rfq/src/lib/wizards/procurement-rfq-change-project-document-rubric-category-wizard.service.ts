/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { BasicsSharedDocumentWizard } from '@libs/documents/shared';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { ProcurementRfqDocumentProjectDataService } from '../services/procurement-rfq-project-document-data.service';

/**
 * Procurement RFQ Change Project Document RubricCategory Wizard
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		//Todo: We required "ProcurementRfqDocumentProjectDataService" service for ProcurementRfqChangeProjectDocumentRubricCategoryWizardService wizard so that I created but actual functionality is pending.
		const dataService = context.injector.get(ProcurementRfqDocumentProjectDataService);
		new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}