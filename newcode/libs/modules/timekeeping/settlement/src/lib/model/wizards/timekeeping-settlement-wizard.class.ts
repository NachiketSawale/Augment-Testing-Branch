/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { TimekeepingSettlementStatusWizardService } from '../../services/wizards/timekeeping-settlement-change-status-wizard.service';

export class TimekeepingSettlementWizardClass {

	public changeStatusWizard(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingSettlementStatusWizardService);
		service.onStartChangeStatusWizard();
	}

}