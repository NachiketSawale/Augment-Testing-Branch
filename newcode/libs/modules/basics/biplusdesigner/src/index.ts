/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsBiplusdesignerModuleInfo } from './lib/model/basics-biplusdesigner-module-info.class';

export * from './lib/basics-biplusdesigner.module';

/**
 * Returns the module info object for the basics biplusdesigner module.
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
	return BasicsBiplusdesignerModuleInfo.instance;
}
