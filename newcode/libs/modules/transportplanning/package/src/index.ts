/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TransportplanningPackageModuleInfo } from './lib/model/transportplanning-package-module-info.class';

export * from './lib/transportplanning-package.module';
export * from './lib/model/wizards/transportplanning-package-wizard';

/**
 * Returns the module info object for the transportplanning package module.
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
	return TransportplanningPackageModuleInfo.instance;
}
