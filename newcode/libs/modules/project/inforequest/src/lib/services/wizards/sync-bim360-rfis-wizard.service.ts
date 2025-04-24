/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IIdentificationData, IInitializationContext } from '@libs/platform/common';
import { BasicsSharedSyncBim360RFIsDialogService, IBasicsSyncBim360DataOptions } from '@libs/basics/shared';
import { ProjectInfoRequestDataService } from '../project-info-request-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectInfoRequestSyncBim360RFIsWizardService {
	public synchronizeBim360RFIs(context: IInitializationContext) {
		const dataService = context.injector.get(ProjectInfoRequestDataService);
		const syncDialogService = context.injector.get(BasicsSharedSyncBim360RFIsDialogService);
		const options = this.getSyncOptions(context, dataService);
		syncDialogService.showDialog(options, syncDialogService).then();
	}

	private getSyncOptions(context: IInitializationContext, dataService: ProjectInfoRequestDataService) {
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
