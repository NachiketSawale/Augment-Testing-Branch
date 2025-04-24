/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingTemplateModuleInfo } from './lib/model/scheduling-template-module-info.class';

export * from './lib/scheduling-template.module';
export * from './lib/services/activity-template-lookup-provider.service';
/**
 * Returns the module info object for the scheduling template module.
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
	return SchedulingTemplateModuleInfo.instance;
}
