/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {BasicsSharedDocumentWizard} from '@libs/documents/shared';

import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { ProcurementPackageDocumentProjectDataService } from '../services/procurement-package-document-project-data.service';

/**
 * Procurement Package Change Project Document RubricCategory Wizard
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService{
	public async execute(context: IInitializationContext) {
        //Todo: We required "ProcurementPackageDocumentProjectDataService" service for ProcurementPackageChangeProjectDocumentRubricCategoryWizard wizard so that I created but actual functionality is pending.
		const dataService = context.injector.get(ProcurementPackageDocumentProjectDataService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}