/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectEfbsheetsModuleInfo } from './lib/model/project-efbsheets-module-info.class';

export * from './lib/project-efbsheets.module';
export * from './lib/model/project-efbsheets-module-add-on.class';
export * from './lib/services/project-efbsheets-crew-mix-cost-code-data.service';

/**
 * Returns the module info object for the project efbsheets module.
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
	return ProjectEfbsheetsModuleInfo.instance;
}
