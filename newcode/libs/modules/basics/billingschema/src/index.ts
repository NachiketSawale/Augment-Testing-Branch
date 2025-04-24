/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsBillingschemaModuleInfo } from './lib/model/basics-billingschema-module-info.class';

export * from './lib/basics-billingschema.module';

/**
 * Returns the module info object for the basics billingschema module.
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
	return BasicsBillingschemaModuleInfo.instance;
}
