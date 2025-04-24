/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceComponenttypeModuleInfo } from './lib/model/resource-componenttype-module-info.class';

export * from './lib/resource-componenttype.module';
export * from './lib/services/resource-component-type-data.service';

/**
 * Returns the module info object for the resource componenttype module.
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
	return ResourceComponenttypeModuleInfo.instance;
}
