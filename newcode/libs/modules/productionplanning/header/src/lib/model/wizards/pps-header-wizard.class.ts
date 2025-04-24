import { IInitializationContext } from '@libs/platform/common';
import { runInInjectionContext } from '@angular/core';
import { PpsUpstreamItemChangeStatusWizardService, PpsUpstreamItemDataServiceManager } from '@libs/productionplanning/item';

import { PpsHeaderDisableWizardService } from '../../services/wizards/pps-header-disable-wizard.service';
import { PpsHeaderEnableWizardService } from '../../services/wizards/pps-header-enable-wizard.service';
import { PpsHeaderChangeStatusWizardService } from '../../services/wizards/pps-header-change-status-wizard.service';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';
import { PpsHeaderChangeProjectDocumentStatusWizardService } from '../../services/wizards/pps-header-change-project-document-status-wizard.service';


export class PpsHeaderWizard {

	public enableHeader(context: IInitializationContext) {
		const service = context.injector.get(PpsHeaderEnableWizardService);
		service.onStartEnableWizard();
	}

	public disableHeader(context: IInitializationContext) {
		const service = context.injector.get(PpsHeaderDisableWizardService);
		service.onStartDisableWizard();
	}

	public changeHeaderStatus(context: IInitializationContext) {
		const service = context.injector.get(PpsHeaderChangeStatusWizardService);
		service.onStartChangeStatusWizard();
	}

	public changeUpstreamStatus(context: IInitializationContext) {
		const upstreamItemDataServ = PpsUpstreamItemDataServiceManager.getDataService(
			{
				containerUuid: '23edab99edgb492d84r29947e734fh99',
				parentServiceFn: (ctx) => {
					return ctx.injector.get(PpsHeaderDataService);
				},
				endPoint: 'listbyppsheader',
				mainItemColumn: 'Id',
				ppsItemColumn: 'NotExistingColumnName', //no ppsitem
				ppsHeaderColumn: 'Id',
			},
			context
		);
		const service = runInInjectionContext(context.injector, () => new PpsUpstreamItemChangeStatusWizardService(
			upstreamItemDataServ
		));
		service.onStartChangeStatusWizard();
	}

	public changeDocumentProjectStatus(context: IInitializationContext) {
		const dataService = context.injector.get(PpsHeaderChangeProjectDocumentStatusWizardService);
		dataService.onStartChangeStatusWizard();
	}

}