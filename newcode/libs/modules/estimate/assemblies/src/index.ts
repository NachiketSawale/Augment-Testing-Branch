/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { EstimateAssembliesModuleInfo } from './lib/model/estimate-assemblies-module-info.class';

export * from './lib/estimate-assemblies.module';
export * from './lib/wizards/estimate-assemblies-wizard.class';
export * from './lib/model/entities/est-line-item-entity.interface';
export * from './lib/containers/assemblies/estimate-assemblies-data.service';
export * from './lib/model/complete/est-assembly-cat-complete.class';


/**
 * Returns the module info object for the estimate assemblies module.
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
	return EstimateAssembliesModuleInfo.instance;
}
