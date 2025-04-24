

import { IInitializationContext } from '@libs/platform/common';
import { TimekeepingShiftModelWizardService } from '../../services/wizards/timekeeping-shiftmodel-wizard.service';

export class TimekeepingShiftmodelWizardClass{

	public createExceptionDaysFromCalendar(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingShiftModelWizardService);
		service.createExceptionDaysFromCalendar();
	}
}