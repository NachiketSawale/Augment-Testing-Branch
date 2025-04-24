/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IIdentificationData, IInitializationContext } from '@libs/platform/common';
import { DefectMainHeaderDataService } from '../defect-main-header-data.service';
import { BasicsSharedSyncBim360IssuesDialogService, IBasicsSyncBim360DataOptions } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class DefectMainSyncBim360IssuesWizardService {
	public synchronizeBim360Issues(context: IInitializationContext) {
		const dataService = context.injector.get(DefectMainHeaderDataService);
		const syncDialogService = context.injector.get(BasicsSharedSyncBim360IssuesDialogService);
		const options = this.getSyncOptions(context, dataService);
		syncDialogService.showDialog(options, syncDialogService).then();
	}

	private getSyncOptions(context: IInitializationContext, dataService: DefectMainHeaderDataService) {
		const options: IBasicsSyncBim360DataOptions = {
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
