/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningProductionsetModuleInfo } from './lib/model/productionplanning-productionset-module-info.class';

export * from './lib/productionplanning-productionset.module';

/**
 * Returns the module info object for the productionplanning productionset module.
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
	return ProductionplanningProductionsetModuleInfo.instance;
}
