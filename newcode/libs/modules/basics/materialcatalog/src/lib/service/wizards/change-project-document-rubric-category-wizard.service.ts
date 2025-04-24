/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {BasicsSharedDocumentWizard} from '@libs/documents/shared';
import {MaterialCatalogDocumentProjectDataService} from '../material-catalog-document-project-data.service';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';


/**
 * Change Project Document RubricCategory Wizard
 */
@Injectable({
    providedIn: 'root'
})
export class ChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(MaterialCatalogDocumentProjectDataService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}