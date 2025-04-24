/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticJobModuleInfo } from './lib/model/logistic-job-module-info.class';

export * from './lib/logistic-job.module';

/**
 * Returns the module info object for the logistic job module.
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
	return LogisticJobModuleInfo.instance;
}
