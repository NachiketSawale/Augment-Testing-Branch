/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedDocumentWizard } from '@libs/documents/shared';
import { IInitializationContext } from '@libs/platform/common';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { EngineeringDocumentProjectDataService } from '../engineering-document-project-data.service';

@Injectable({
	providedIn: 'root',
})
export class EngTaskChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(EngineeringDocumentProjectDataService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}
