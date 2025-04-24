/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningPpscostcodesModuleInfo } from './lib/model/productionplanning-ppscostcodes-module-info.class';

export * from './lib/productionplanning-ppscostcodes.module';

/**
 * Returns the module info object for the productionplanning ppscostcodes module.
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
	return ProductionplanningPpscostcodesModuleInfo.instance;
}
