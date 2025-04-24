/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ConstructionsystemPreloadInfo } from './lib/model/constructionsystem-preload-info.class';

export * from './lib/constructionsystem-preload.module';

/**
 * Returns the module info object for the constructionsystem preload module.
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
	return ConstructionsystemPreloadInfo.instance;
}
