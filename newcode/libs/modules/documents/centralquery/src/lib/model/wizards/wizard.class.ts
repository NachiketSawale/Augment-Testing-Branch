/*
 * Copyright(c) RIB Software GmbH
 */
import {IInitializationContext} from '@libs/platform/common';
import {DocumentsCentralQueryChangeProjectDocumentStatusWizardService} from '../../service/wizards/documents-centralquery-change-project-docoment-status-wizard.service';
import { DocumentsCentralQuerySyncBim360DocumentsWizardService } from '../../service/wizards/sync-bim360-docoments-wizard.service';


export class DocumentCentralQueryWizard {

    public changeDocumentProjectStatus(context: IInitializationContext) {
        const dataService = context.injector.get(DocumentsCentralQueryChangeProjectDocumentStatusWizardService);
        dataService.onStartChangeStatusWizard();
    }

	public syncBim360Document(context: IInitializationContext) {
		const syncService = context.injector.get(DocumentsCentralQuerySyncBim360DocumentsWizardService);
		syncService.synchronizeBim360Documents(context);
	}

	public syncDocument2Bim360(context: IInitializationContext) {
		const syncService = context.injector.get(DocumentsCentralQuerySyncBim360DocumentsWizardService);
		syncService.synchronizeDocumentsToBim360(context);
	}
}