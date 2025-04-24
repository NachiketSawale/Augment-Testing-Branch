/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsCompanyModuleInfo } from './lib/model/basics-company-module-info.class';

export * from './lib/basics-company.module';

/**
 * Returns the module info object for the basics company module.
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
	return BasicsCompanyModuleInfo.instance;
}
