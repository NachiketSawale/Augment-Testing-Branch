/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IIdentificationData, IInitializationContext } from '@libs/platform/common';
import { DocumentsCentralQueryHeaderService } from '../../document-header/documents-centralquery-header.service';
import { BasicsSharedSyncBim360DocumentsDialogService, BasicsSharedSyncDocumentsToBim360DialogService, IBasicsSyncBim360DocumentsOptions } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class DocumentsCentralQuerySyncBim360DocumentsWizardService {

	public synchronizeBim360Documents(context: IInitializationContext) {
		const dataService = context.injector.get(DocumentsCentralQueryHeaderService);
		const syncDialogService = context.injector.get(BasicsSharedSyncBim360DocumentsDialogService);
		const options = this.getSyncOptions(context, dataService);
		syncDialogService.showDialog(options, syncDialogService);
	}

	public synchronizeDocumentsToBim360(context: IInitializationContext) {
		const dataService = context.injector.get(DocumentsCentralQueryHeaderService);
		const syncDialogService = context.injector.get(BasicsSharedSyncDocumentsToBim360DialogService);
		const options = this.getSyncOptions(context, dataService);
		syncDialogService.showDialog(options, syncDialogService);
	}

	private getSyncOptions(context: IInitializationContext, dataService: DocumentsCentralQueryHeaderService) {
		const options: IBasicsSyncBim360DocumentsOptions = {
			initContext: context,
			afterSynchronized: async (toSelect: IIdentificationData[]): Promise<void> => {
				await dataService.refreshAll();
				if (toSelect.length > 0) {
					await dataService.selectById(toSelect);
				}
			},
		};
		return options;
	}
}
