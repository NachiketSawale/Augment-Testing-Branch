/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingPeriodModuleInfo } from './lib/model/timekeeping-period-module-info.class';
export * from './lib/model/entities/wizards/timekeeping-period-wizard.class';

export * from './lib/timekeeping-period.module';
export  * from './lib/model/entities/period-entity.interface';
export * from './lib/model/entities/timekeeping-validation-entity.interface';
export * from './lib/model/timekeeping-period-validation.layout.model';
export * from './lib/services/wizard/timekeeping-generate-timesheet-records.service';
export * from './lib/services/wizard/timekeeping-create-period-transaction.service';
/**
 * Returns the module info object for the timekeeping period module.
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
	return TimekeepingPeriodModuleInfo.instance;
}
