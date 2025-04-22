/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {BasicsSharedDocumentWizard} from '@libs/documents/shared';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { ProcurementRequisitionDocumentProjectDataService } from '../services/procurement-requisition-document-project-data.service';


/**
 * Change Project Document RubricCategory Wizard
 */
@Injectable({
    providedIn: 'root'
})
export class ChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(ProcurementRequisitionDocumentProjectDataService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}
