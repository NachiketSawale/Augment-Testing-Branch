/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext } from '@libs/platform/common';
import { TransportPlanningPackageWizardChangeStatusService } from '../../services/wizards/transportplanning-package-wizard-change-status.service';

export class TransportPlanningPackageWizard {
	public changePackageStatus(context: IInitializationContext) {
		const service = context.injector.get(TransportPlanningPackageWizardChangeStatusService);
		service.onStartChangeStatusWizard();
	}
}
