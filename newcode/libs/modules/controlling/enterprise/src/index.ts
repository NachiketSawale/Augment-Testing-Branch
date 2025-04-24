/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ControllingEnterpriseModuleInfo } from './lib/model/controlling-enterprise-module-info.class';

export * from './lib/controlling-enterprise.module';

/**
 * Returns the module info object for the controlling enterprise module.
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
	return ControllingEnterpriseModuleInfo.instance;
}
