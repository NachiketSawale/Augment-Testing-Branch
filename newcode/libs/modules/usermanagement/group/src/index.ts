/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { UsermanagementGroupModuleInfo } from './lib/model/usermanagement-group-module-info.class';

export * from './lib/usermanagement-group.module';
export * from './lib/services/group-lookup-provider.service';
export * from '@libs/usermanagement/interfaces';

/**
 * Returns the module info object for the usermanagement group module.
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
	return UsermanagementGroupModuleInfo.instance;
}
