/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { MtwoInterfacesModuleInfo } from './lib/model/mtwo-interfaces-module-info.class';

export * from './lib/mtwo-interfaces.module';
export * from './lib/model/entities/index';

/**
 * Returns the module info object for the mtwo interfaces module.
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
	return MtwoInterfacesModuleInfo.instance;
}
