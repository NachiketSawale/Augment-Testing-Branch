/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SalesBillingModuleInfo } from './lib/model/sales-billing-module-info.class';
export * from './lib/wizards/index';
export * from './lib/sales-billing.module';
export * from './lib/wizards/index';
/**
 * Returns the module info object for the sales billing module.
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
	return SalesBillingModuleInfo.instance;
}
