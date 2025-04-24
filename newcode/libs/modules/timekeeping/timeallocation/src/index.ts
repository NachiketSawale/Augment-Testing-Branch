/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingTimeallocationModuleInfo } from './lib/model/timekeeping-timeallocation-module-info.class';

export * from './lib/timekeeping-timeallocation.module';
export * from './lib/model/wizards/timekeeping-timeallocation-wizard.class';
/**
 * Returns the module info object for the timekeeping timeallocation module.
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
	return TimekeepingTimeallocationModuleInfo.instance;
}
