/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectPlantassemblyModuleInfo } from './lib/model/project-plantassembly-module-info.class';

export * from './lib/project-plantassembly.module';
export * from './lib/model/wizards/project-plantassembly.class';
/**
 * Returns the module info object for the project plantassembly module.
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
	return ProjectPlantassemblyModuleInfo.instance;
}

export * from './lib/containers/assemblies/project-plant-assembly-entity-info.model';
export * from './lib/containers/resources/project-plant-assembly-resource-entity-info.model';
