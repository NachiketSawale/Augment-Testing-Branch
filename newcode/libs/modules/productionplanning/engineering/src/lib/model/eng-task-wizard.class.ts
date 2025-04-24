import { IInitializationContext } from '@libs/platform/common';
import { EngTaskChangeStatusWizardService } from '../services/wizards/eng-task-change-status-wizard.service';
import { EngTaskEnableWizardService } from '../services/wizards/eng-task-enable-wizard.service';
import { EngTaskDisableWizardService } from '../services/wizards/eng-task-disable-wizard.service';
import { EngTaskChangeProjectDocumentStatusWizardService } from '../services/wizards/eng-task-change-project-document-status-wizard.service';

export class EngTaskWizard {
	public changeStatus(context: IInitializationContext) {
		const service = context.injector.get(EngTaskChangeStatusWizardService);
		service.onStartChangeStatusWizard();
	}

	public enable(context: IInitializationContext) {
		const service = context.injector.get(EngTaskEnableWizardService);
		service.onStartEnableWizard();
	}

	public disable(context: IInitializationContext) {
		const service = context.injector.get(EngTaskDisableWizardService);
		service.onStartDisableWizard();
	}

	public changeDocumentProjectStatus(context: IInitializationContext) {
		const dataService = context.injector.get(EngTaskChangeProjectDocumentStatusWizardService);
		dataService.onStartChangeStatusWizard();
	}
}
