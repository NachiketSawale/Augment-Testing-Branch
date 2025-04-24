/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningEngineeringModuleInfo } from './lib/model/productionplanning-engineering-module-info.class';

export * from './lib/productionplanning-engineering.module';
export * from './lib/model/eng-task-wizard.class';
export * from './lib/services/lookups/engineering-header-lookup-provider.service';

/**
 * Returns the module info object for the productionplanning engineering module.
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
	return ProductionplanningEngineeringModuleInfo.instance;
}
