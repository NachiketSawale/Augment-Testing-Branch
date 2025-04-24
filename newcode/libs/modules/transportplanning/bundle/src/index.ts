/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TransportplanningBundleModuleInfo } from './lib/model/transportplanning-bundle-module-info.class';

export * from './lib/transportplanning-bundle.module';
export * from './lib/model/wizards/transportplanning-bundle-wizard';

/**
 * Returns the module info object for the transportplanning bundle module.
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
	return TransportplanningBundleModuleInfo.instance;
}
