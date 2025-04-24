/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingMainModuleInfo } from './lib/model/scheduling-main-module-info.class';

export * from './lib/scheduling-main.module';
export * from './lib/wizards/scheduling-main-wizard.class';
export * from './lib/services/scheduling-activity-lookup-provider.service';
export * from './lib/wizards/scheduling-add-progress-to-schedule-activities.service';
export * from './lib/wizards/reschedule-uncomplete-activities/scheduling-main-reschedule-uncompleted-activities-wizard.service';
export * from './lib/services/scheduling-main-event-lookup-provider.service';
export * from './lib/services/scheduling-main-data.service';
export * from './lib/services/scheduling-main-activity-2model-object-lookup-provider.service';
export * from './lib/services/scheduling-progress-report-line-item-header-lookup-provider.service';

/**
 * Returns the module info object for the scheduling main module.
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
	return SchedulingMainModuleInfo.instance;
}
