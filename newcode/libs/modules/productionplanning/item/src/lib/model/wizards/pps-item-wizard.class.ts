import { IInitializationContext } from '@libs/platform/common';
import { runInInjectionContext } from '@angular/core';
import { PpsItemDataService } from '../../services/pps-item-data.service';
import { PpsUpstreamItemDataServiceManager } from '../../services/upstream-item/pps-upstream-item-data-service-manager.service';
import { PpsUpstreamItemChangeStatusWizardService } from '../../services/upstream-item/pps-upstream-item-change-status-wizard.service';
import {
	PpsItemChangeProjectDocumentStatusWizardService
} from '../../services/wizards/pps-item-change-project-document-status-wizard.service';

export class PpsItemWizard {

	// todo: enableItem

	// todo: diableItem

	// todo: changeItemStatus


	public changeUpstreamStatus(context: IInitializationContext) {
		const upstreamItemDataServ = PpsUpstreamItemDataServiceManager.getDataService(
			{
				containerUuid: '23edab57edgb492d84r2gv47e734fh8u',
				parentServiceFn: (ctx) => {
					return ctx.injector.get(PpsItemDataService);
				},
			},
			context
		);
		const service = runInInjectionContext(context.injector, () => new PpsUpstreamItemChangeStatusWizardService(
			upstreamItemDataServ
		));
		service.onStartChangeStatusWizard();
	}

	public changeDocumentProjectStatus(context: IInitializationContext) {
		const dataService = context.injector.get(PpsItemChangeProjectDocumentStatusWizardService);
		dataService.onStartChangeStatusWizard();
	}
}