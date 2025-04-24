/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ServicesScheduleruiModuleInfo } from './lib/job-list/model/services-schedulerui-module-info.class';

export * from './lib/services-schedulerui.module';

/**
 * Returns the module info object for the services schedulerui module.
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
	return ServicesScheduleruiModuleInfo.instance;
}

export * from './lib/job-list/services/services-schedulerui-status-notification.service';

export * from './lib/job-list/services/services-schedulerui-job-log-dialog.service';
