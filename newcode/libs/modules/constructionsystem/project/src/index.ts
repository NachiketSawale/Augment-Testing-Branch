/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ConstructionsystemProjectModuleInfo } from './lib/model/constructionsystem-project-module-info.class';
export * from './lib/model/constructionsystem-project-module-add-on.class';
export * from './lib/model/wizards/constructionsystem-project-wizard.class';
export * from './lib/constructionsystem-project.module';

/**
 * Returns the module info object for the constructionsystem project module.
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
	return ConstructionsystemProjectModuleInfo.instance;
}
