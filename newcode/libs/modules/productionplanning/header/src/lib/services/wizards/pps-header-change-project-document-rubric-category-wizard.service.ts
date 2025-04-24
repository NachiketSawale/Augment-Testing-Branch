/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedDocumentWizard } from '@libs/documents/shared';
import { IInitializationContext } from '@libs/platform/common';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { PpsHeaderDocumentProjectDataService } from '../pps-header-document-project-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(PpsHeaderDocumentProjectDataService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}
