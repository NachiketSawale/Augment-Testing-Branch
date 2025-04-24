/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { MtwoPreloadInfo } from './lib/model/mtwo-preload-info.class';

export * from './lib/mtwo-preload.module';

/**
 * Returns the module info object for the mtwo preload module.
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
	return MtwoPreloadInfo.instance;
}
