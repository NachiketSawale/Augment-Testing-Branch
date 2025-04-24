/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { UsermanagementUserModuleInfo } from './lib/model/usermanagement-user-module-info.class';

export * from './lib/usermanagement-user.module';
export * from './lib/services/user-lookup-provider.service';

/**
 * Returns the module info object for the usermanagement user module.
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
	return UsermanagementUserModuleInfo.instance;
}

export * from './lib/services/usermanagement-user-data.service';