import { IInitializationContext } from '@libs/platform/common';
import { TimekeepingPeriodWizardService } from '../../../services/wizard/timekeeping-period-wizard.service';

export class TimekeepingPeriodWizardClass {


	public setPeriodStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingPeriodWizardService);
		service.onStartChangeStatusWizard();
	}
	public lockIsSuccess(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingPeriodWizardService);
		service.lockIsSuccess();
	}
	public unlockIsSuccess(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingPeriodWizardService);
		service.unlockIsSuccess();
	}
}