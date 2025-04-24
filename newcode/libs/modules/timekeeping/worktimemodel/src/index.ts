/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingWorktimemodelModuleInfo } from './lib/model/timekeeping-worktimemodel-module-info.class';

export * from './lib/model/wizards/timekeeping-work-time-model-wizard.class';

export * from './lib/timekeeping-worktimemodel.module';
export * from './lib/services/timekeeping-worktimemodel-lookup-provider.service';
/**
 * Returns the module info object for the timekeeping worktimemodel module.
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
	return TimekeepingWorktimemodelModuleInfo.instance;
}
