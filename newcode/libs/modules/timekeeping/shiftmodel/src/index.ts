/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingShiftmodelModuleInfo } from './lib/model/timekeeping-shiftmodel-module-info.class';

export * from './lib/timekeeping-shiftmodel.module';
export * from './lib/services/timekeeping-shift-model-data.service';
export * from './lib/model/wizards/timekeeping-shiftmodel-wizard.class';

/**
 * Returns the module info object for the timekeeping shiftmodel module.
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
	return TimekeepingShiftmodelModuleInfo.instance;
}
