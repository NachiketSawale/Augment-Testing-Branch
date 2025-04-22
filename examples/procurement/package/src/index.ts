/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementPackageModuleInfo } from './lib/model/procurement-package-module-info.class';

export * from './lib/procurement-package.module';
export * from './lib/model/wizards/index';
export * from './lib/wizards/index';
export * from './lib/model/Items/package-import-status-items';
export * from './lib/services/filters/package-header-project-filter.service';
export * from './lib/services/package-header-data-provider.service';
export * from './lib/services/package-header-data.service';
export * from './lib/services/package-2header-data-provider.service';
/**
 * Returns the module info object for the procurement package module.
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
	return ProcurementPackageModuleInfo.instance;
}
