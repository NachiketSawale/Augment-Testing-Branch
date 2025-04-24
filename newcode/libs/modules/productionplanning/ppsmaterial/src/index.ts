/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningPpsmaterialModuleInfo } from './lib/model/productionplanning-ppsmaterial-module-info.class';

export * from './lib/productionplanning-ppsmaterial.module';

/**
 * Returns the module info object for the productionplanning ppsmaterial module.
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
	return ProductionplanningPpsmaterialModuleInfo.instance;
}
