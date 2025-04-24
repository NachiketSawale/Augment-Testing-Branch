/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';

import { TimekeepingWorkTimeModelDisableWizardService } from '../../services/wizards/timekeeping-work-time-model-disable-wizard.service';
import { TimekeepingWorkTimeModelEnableWizardService } from '../../services/wizards/timekeeping-work-time-model-enable-wizard.service';
export class TimekeepingWorkTimeModelDisableWizardClass {


	public enableWorkTimeModel(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingWorkTimeModelEnableWizardService);
		service.onStartEnableWizard();
	}
	public disableWorkTimeModel(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingWorkTimeModelDisableWizardService);
		service.onStartDisableWizard();
	}
}