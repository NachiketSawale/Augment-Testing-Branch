/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { TimekeepingTimeallocationStatusWizardService } from '../../services/wizards/timekeeping-timeallocation-status-wizard.service';
import { TimekeepingTimeallocationRepotStatusWizardService } from '../../services/wizards/timekeeping-timeallocation-repot-status-wizard.service';
import { TimekeepingTimeallocationCreateResultWizardService } from '../../services/wizards/timekeeping-timeallocation-create-result-wizard.service';
import { TimekeepingTimeallocationCreateDispatchingRecordsWizard } from '../../services/wizards/timekeeping-timeallocation-create-dispatching-records-wizard.service';

export class TimeKeepingTimeallocationWizardClass {

	public setTimeAllocationStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeallocationStatusWizardService);
		service.setTimeAllocationStatus();
	}

	public setReportStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeallocationRepotStatusWizardService);
		service.setReportStatus();
	}

	public createResult(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeallocationCreateResultWizardService);
		service.createResult();
	}

	public levelAllocatedTimes(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeallocationCreateResultWizardService);
		service.levelAllocatedTimes();
	}

	public createResultHeaders(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeallocationCreateResultWizardService);
		service.createResultHeaders();
	}

	public createDispatchingRecords(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeallocationCreateDispatchingRecordsWizard);
		service.createDispatchingRecords();
	}

}