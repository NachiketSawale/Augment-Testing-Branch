/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectStockModuleInfo } from './lib/model/project-stock-module-info.class';

export * from './lib/project-stock.module';

// project stock data services, validation services and stock location behavior
export * from './lib/services/project-stock-data.service';
export * from './lib/services/project-stock-validation.service';
export * from './lib/services/project-stock-material-data.service';
export * from './lib/services/project-stock-material-validation.service';
export * from './lib/services/project-stock-downtime.service';
export * from './lib/services/project-stock-downtime-validation.service';
export * from './lib/services/project-stock-clerk-data.service';
export * from './lib/services/project-stock-clerk-validation.service';
export * from './lib/services/project-stock-location-data.service';
export * from './lib/services/project-stock-location-validation.service';
export * from './lib/behaviors/project-stock-location-behavior.service';


/**
 * Returns the module info object for the project stock module.
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
	return ProjectStockModuleInfo.instance;
}
