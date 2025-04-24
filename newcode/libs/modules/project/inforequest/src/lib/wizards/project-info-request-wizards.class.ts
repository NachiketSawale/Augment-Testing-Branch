/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ProjectInfoRequestSyncBim360RFIsWizardService } from '../services/wizards/sync-bim360-rfis-wizard.service';

export class ProjectInfoRequestWizards {
	public syncBim360Issues(context: IInitializationContext) {
		const syncService = context.injector.get(ProjectInfoRequestSyncBim360RFIsWizardService);
		syncService.synchronizeBim360RFIs(context);
	}
}
