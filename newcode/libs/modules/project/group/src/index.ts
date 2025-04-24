/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectGroupModuleInfo } from './lib/model/project-group-module-info.class';

export * from './lib/project-group.module';
export * from './lib/model/wizards/project-group.wizard';

/**
 * Returns the module info object for the project group module.
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
	return ProjectGroupModuleInfo.instance;
}
