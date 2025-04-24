/*
 * Copyright(c) RIB Software GmbH
 */


import { TimekeepingTimesymbolsModuleInfo } from './lib/model/timekeeping-timesymbols-module-info.class';
import { IApplicationModuleInfo } from '@libs/platform/common';
export * from './lib/model/wizards/timekeeping-time-symbol-wizard.class';
export * from './lib/timekeeping-timesymbols.module';
export * from './lib/services/timekeeping-time-symbol-lookup-provider.service';
export * from './lib/services/timekeeping-timekeeping-group-lookup-provider.service';
/**
 * Returns the module info object for the timekeeping timesymbols module.
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
	return TimekeepingTimesymbolsModuleInfo.instance;
}
