/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ControllingControllingunittemplateModuleInfo } from './lib/model/controlling-controllingunittemplate-module-info.class';

export * from './lib/controlling-controllingunittemplate.module';

/**
 * Returns the module info object for the controlling controllingunittemplate module.
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
	return ControllingControllingunittemplateModuleInfo.instance;
}
