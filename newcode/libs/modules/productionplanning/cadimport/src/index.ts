/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningCadimportModuleInfo } from './lib/model/productionplanning-cadimport-module-info.class';

export * from './lib/productionplanning-cadimport.module';

/**
 * Returns the module info object for the productionplanning cadimport module.
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
	return ProductionplanningCadimportModuleInfo.instance;
}
