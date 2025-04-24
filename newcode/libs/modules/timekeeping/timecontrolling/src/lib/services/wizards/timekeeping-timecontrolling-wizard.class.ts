/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { TimekeepingTimecontrollingDerivationsWizard } from './timekeeping-timecontrolling-derivations-wizard.service';
import { TimekeepingTimecontrollingReportStatusWizardService } from './timekeeping-timecontrolling-report-status-wizard.service';
import { TimekeepingTimecontrollingReportEnableWizardService } from './timekeeping-timecontrolling-report-enable-wizard.service';
import { TimekeepingTimecontrollingReportDisableWizardService } from './timekeeping-timecontrolling-report-disable-wizard.service';

export class TimekeepingTimecontrollingWizardClass {

	public calculateOtherDerivations(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimecontrollingDerivationsWizard);
		service.calculateOtherDerivations(context);
	}

	public calculateOvertime(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimecontrollingDerivationsWizard);
		service.calculateOvertime(context);
	}

	public setReportStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimecontrollingReportStatusWizardService);
		service.onStartChangeStatusWizard();
	}

	public enableReports(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimecontrollingReportEnableWizardService);
		service.onStartEnableWizard();
	}

	public disableReports(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimecontrollingReportDisableWizardService);
		service.onStartDisableWizard();
	}
}