/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningFabricationunitModuleInfo } from './lib/model/productionplanning-fabricationunit-module-info.class';

export * from './lib/productionplanning-fabricationunit.module';

export * from './lib/model/wizard.class';
export * from './lib/model/models';

/**
 * Returns the module info object for the productionplanning fabricationunit module.
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
	return ProductionplanningFabricationunitModuleInfo.instance;
}
