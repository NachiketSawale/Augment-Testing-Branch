/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { UsermanagementRightModuleInfo } from './lib/model/usermanagement-right-module-info.class';
export * from './lib/model/wizards/usermanagement-right-wizards.class';

export * from './lib/usermanagement-right.module';
export * from './lib/model/wizards/usermanagement-right-wizards.class';
export * from './lib/role-xrole/services/role-lookup-provider.service';
/**
 * Returns the module info object for the usermanagement right module.
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
	return UsermanagementRightModuleInfo.instance;
}
