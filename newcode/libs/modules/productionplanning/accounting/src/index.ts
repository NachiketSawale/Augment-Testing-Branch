/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningAccountingModuleInfo } from './lib/model/productionplanning-accounting-module-info.class';

export * from './lib/productionplanning-accounting.module';

/**
 * Returns the module info object for the productionplanning accounting module.
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
	return ProductionplanningAccountingModuleInfo.instance;
}
