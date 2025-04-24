/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import {BasicsSharedDocumentWizard} from '@libs/documents/shared';
import { IBasicChangeProjectDocumentRubricCategoryService } from '@libs/basics/interfaces';
import { DocumentsCentralQueryHeaderService } from '../../document-header/documents-centralquery-header.service';

/**
 * Change Project Document RubricCategory Wizard
 */
@Injectable({
	providedIn: 'root'
})
export class ChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) {
		const dataService = context.injector.get(DocumentsCentralQueryHeaderService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}