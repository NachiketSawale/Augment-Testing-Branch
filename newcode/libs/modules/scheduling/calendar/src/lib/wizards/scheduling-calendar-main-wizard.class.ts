/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { SchedulingCalendarExceptiondayWizardService } from './scheduling-calendar-exceptionday-wizard.service';
import { SchedulingCalendarEnableWizardService } from './scheduling-calendar-enable-wizard.service';
import { SchedulingCalendarDisableWizardService } from './scheduling-calendar-disable-wizard.service';
export class SchedulingCalendarMainWizard {
	public createBankHoliday(context: IInitializationContext,wizard:number) {
		const service = context.injector.get(SchedulingCalendarExceptiondayWizardService);
		service.createExceptionDays(wizard);
	}

	public disableCalendar(context: IInitializationContext) {
		const service = context.injector.get(SchedulingCalendarDisableWizardService);
		service.onStartDisableWizard();
	}

	public enableCalendar(context: IInitializationContext) {
		const service = context.injector.get(SchedulingCalendarEnableWizardService);
		service.onStartEnableWizard();
	}

	public deleteCalendar(context:IInitializationContext){
		const service = context.injector.get(SchedulingCalendarEnableWizardService);
		service.deleteCalendar();
	}
}