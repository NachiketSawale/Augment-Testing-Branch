/*
 * Copyright(c) RIB Software GmbH
 */
import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingTimecontrollingModuleInfo } from './lib/model/timekeeping-timecontrolling-module-info.class';

export * from './lib/timekeeping-timecontrolling.module';
export * from './lib/services/wizards/timekeeping-timecontrolling-derivations-wizard.service';
export * from './lib/services/timekeeping-time-controlling-report-data.service';
export * from './lib/services/wizards/timekeeping-timecontrolling-wizard.class';

/**
 * Returns the module info object for the timekeeping timecontrolling module.
 *
 * This function implements the {@link IApplicationModule.getModuleInfo} method.
 * Do not remove it.
 * It may be called by generated code.
 *
 * @return The singleton instance of the module info object.
 *
 * @see {@link IApplicationModule.getModuleInfo}
 */
export function getModuleInfo(): IApplicationModuleInfo {
	return TimekeepingTimecontrollingModuleInfo.instance;
}
