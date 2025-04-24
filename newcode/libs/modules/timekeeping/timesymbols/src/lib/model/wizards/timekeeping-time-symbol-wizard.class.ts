/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { TimekeepingTimeSymbolEnableWizardService } from '../../services/wizards/timekeeping-time-symbol-enable-wizard.service';
import { TimekeepingTimeSymbolDisableWizardService } from '../../services/wizards/timekeeping-time-symbol-disable-wizard.service';
export class TimekeepingTimeSymbolWizardClass {



	public enableTimeSymbols(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeSymbolEnableWizardService);
		service.onStartEnableWizard();
	}

	public disableTimeSymbols(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingTimeSymbolDisableWizardService);
		service.onStartDisableWizard();
	}
}