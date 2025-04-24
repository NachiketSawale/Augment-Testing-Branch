/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext } from '@libs/platform/common';
import {ChangeProjectDocumentRubricCategoryWizardService} from '../../service/wizards/change-project-document-rubric-category-wizard.service';
import {DocumentProjectDataRootService} from '../../document-project/services/document-project-data-root.service';
export class BasicsSharedDocumentWizard {

    public changeProjectDocumentRubricCategory(context: IInitializationContext, documentDataService: DocumentProjectDataRootService<object>) {
        const service = context.injector.get(ChangeProjectDocumentRubricCategoryWizardService);
        service.onStartWizard(documentDataService);
    }
}