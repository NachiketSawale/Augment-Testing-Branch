import { IInitializationContext } from '@libs/platform/common';
import { TransportPlanningBundleWizardStatusService } from '../../services/wizards/transportplanning-bundle-wizard-status.service';
import { TransportPlanningBundleEnableWizardService } from '../../services/wizards/transportplanning-bundle-enable-wizard.service';
import { TransportPlanningBundleDisableWizardService } from '../../services/wizards/transportplanning-bundle-disable-wizard.service';
export class TransportPlanningBundleWizard {
	public changeBundleStatus(context: IInitializationContext) {
		const service = context.injector.get(TransportPlanningBundleWizardStatusService);
		service.onStartChangeStatusWizard();
	}

	public enableBundle(context: IInitializationContext) {
		const service = context.injector.get(TransportPlanningBundleEnableWizardService);
		service.onStartEnableWizard();
	}

	public disableBundle(context: IInitializationContext) {
		const service = context.injector.get(TransportPlanningBundleDisableWizardService);
		service.onStartDisableWizard();
	}
}
