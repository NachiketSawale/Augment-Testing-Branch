/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { DefectMainSyncBim360IssuesWizardService } from '../../services/wizards/sync-bim360-issues-wizard.service';
import { ChangeDefectStatusService } from '../../services/wizards/change-defect-status.service';
import { DefectMainCreateNewChangeFromDefectWizardService } from '../../services/wizards/create-new-change-from-defect-wizard.service';

export class DefectMainWizards {
	public syncBim360Issues(context: IInitializationContext) {
		const syncService = context.injector.get(DefectMainSyncBim360IssuesWizardService);
		syncService.synchronizeBim360Issues(context);
	}

	public changeDefectStatus(context: IInitializationContext) {
		const service = context.injector.get(ChangeDefectStatusService);
		service.onStartChangeStatusWizard();
	}

	public createNewChangeFromDefect(context: IInitializationContext) {
		const service = context.injector.get(DefectMainCreateNewChangeFromDefectWizardService);
		service.showCreateDialog();
	}
}
