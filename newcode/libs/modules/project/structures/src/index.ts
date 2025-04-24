/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectStructuresModuleInfo } from './lib/model/project-structures-module-info.class';

export * from './lib/project-structures.module';
export * from './lib/services/project-structures-sortcode01-data.service';
export * from './lib/services/project-structures-sortcode02-data.service';
export * from './lib/services/project-structures-sortcode03-data.service';
export * from './lib/services/project-structures-sortcode04-data.service';
export * from './lib/services/project-structures-sortcode05-data.service';
export * from './lib/services/project-structures-sortcode06-data.service';
export * from './lib/services/project-structures-sortcode07-data.service';
export * from './lib/services/project-structures-sortcode08-data.service';
export * from './lib/services/project-structures-sortcode09-data.service';
export * from './lib/services/project-structures-sortcode10-data.service';

/**
 * Returns the module info object for the project structures module.
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
	return ProjectStructuresModuleInfo.instance;
}
