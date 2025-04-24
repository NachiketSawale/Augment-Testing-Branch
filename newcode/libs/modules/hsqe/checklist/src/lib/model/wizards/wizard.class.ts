/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ChangeCheckListStatusService } from '../../services/wizards/change-checklist-status.service';
import { ChecklistCreationWizardService } from '../../services/wizards/checklist-creation-wizard.service';
import { DefectCreationWizardService } from '../../services/wizards/defect-creation-wizard.service';

export class CheckListWizards {
	public changeCheckListStatus(context: IInitializationContext) {
		const service = context.injector.get(ChangeCheckListStatusService);
		service.onStartChangeStatusWizard();
	}

	public createCheckListFromTemplate(context: IInitializationContext) {
		return new ChecklistCreationWizardService().create();
	}

	public createDefectFromCheckList() {
		return new DefectCreationWizardService().create();
	}
}
