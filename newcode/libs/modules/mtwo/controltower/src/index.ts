/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { MtwoControltowerModuleInfo } from './lib/model/mtwo-controltower-module-info.class';

export * from './lib/mtwo-controltower.module';

/**
 * Returns the module info object for the mtwo controltower module.
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
	return MtwoControltowerModuleInfo.instance;
}
