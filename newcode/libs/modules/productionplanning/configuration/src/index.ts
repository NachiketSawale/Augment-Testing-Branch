/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningConfigurationModuleInfo } from './lib/model/productionplanning-configuration-module-info.class';

export * from './lib/productionplanning-configuration.module';
export * from './lib/model/entities/event-type-entity.interface';

/**
 * Returns the module info object for the productionplanning configuration module.
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
	return ProductionplanningConfigurationModuleInfo.instance;
}
