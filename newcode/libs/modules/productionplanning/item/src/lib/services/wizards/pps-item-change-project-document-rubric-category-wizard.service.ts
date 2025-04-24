import {Injectable} from '@angular/core';
import {IBasicChangeProjectDocumentRubricCategoryService} from '@libs/basics/interfaces';
import {BasicsSharedDocumentWizard} from '@libs/documents/shared';
import {PpsItemDocumentProjectDataService} from '../pps-item-document-project-data.service';
import {IInitializationContext} from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class PpsItemChangeProjectDocumentRubricCategoryWizardService implements IBasicChangeProjectDocumentRubricCategoryService {
	public async execute(context: IInitializationContext) : Promise<void> {
		const dataService = context.injector.get(PpsItemDocumentProjectDataService);
		await new BasicsSharedDocumentWizard().changeProjectDocumentRubricCategory(context, dataService);
	}
}