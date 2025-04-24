/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { EstimateProjectModuleInfo } from './lib/model/estimate-project-module-info.class';

export * from './lib/estimate-project.module';
export * from './lib/model/estimate-project-entity-info.model';
export * from './lib/behaviors/estimate-project-behavior.service';
export * from './lib/services/estimate-project-data.service';
export * from './lib/model/wizards/estimate-project-wizard.class';
export * from './lib/model/estimate-project-clerk-entity-info.model';
export * from './lib/model/estimate-project-specification.class';
export * from './lib/model/estimate-project-module-add-on.class';
export * from './lib/services/lookup/estimate-project-header-lookup.service';
export * from './lib/services/lookup/estimate-project-lookup-provider.service';
/**
 * @brief Function to get module information for the estimate project.
 * Returns the module info object for the estimate project module.
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
	return EstimateProjectModuleInfo.instance;
}
