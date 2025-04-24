/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingScheduleModuleInfo } from './lib/model/scheduling-schedule-module-info.class';

export * from './lib/scheduling-schedule.module';
export * from './lib/model/scheduling-project-module-add-on.class';
export * from './lib/model/services/scheduling-schedule-key-dates-data.service';
export * from './lib/model/entities/timeline-entity.interface';
export * from './lib/model/services/scheduling-schedule-data.service';
export * from './lib/model/services/scheduling-schedule-lookup-provider.service';
/**
 * Returns the module info object for the scheduling schedule module.
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
	return SchedulingScheduleModuleInfo.instance;
}
